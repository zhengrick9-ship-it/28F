const https = require('https');
const { estimateDishNutrition } = require('./nutrition');

function postJson(url, headers, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
        ...headers
      },
      timeout: timeoutMs
    }, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('timeout', () => req.destroy(new Error('AI request timeout')));
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function parseJsonFromText(text) {
  const trimmed = String(text || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!objectMatch) throw error;
    return JSON.parse(objectMatch[0]);
  }
}

function flattenDishes(event) {
  if (Array.isArray(event.dishes)) return event.dishes;
  if (!Array.isArray(event.weeks)) return [];

  const dishes = [];
  event.weeks.forEach(week => {
    (week.days || []).forEach(day => {
      Object.keys(day.meals || {}).forEach(mealKey => {
        (day.meals[mealKey] || []).forEach(dish => {
          dishes.push({
            ...dish,
            weekLabel: week.label,
            date: day.date,
            mealKey
          });
        });
      });
    });
  });
  return dishes;
}

function uniqueDishes(dishes) {
  const seen = new Map();
  dishes.forEach(dish => {
    const key = `${dish.name}|${dish.category}`;
    if (!seen.has(key)) seen.set(key, dish);
  });
  return Array.from(seen.values());
}

function toBaseline(dish) {
  return {
    id: dish.id,
    name: dish.name,
    category: dish.category,
    ...estimateDishNutrition(dish.name, dish.category, dish.kcalPer100g)
  };
}

function saneNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function normalizeAiItem(item, baselineByName) {
  const key = `${item.name}|${item.category}`;
  const baseline = baselineByName[key] || baselineByName[item.name];
  if (!baseline) return null;

  const macros = item.macrosPer100g || {};
  return {
    ...baseline,
    kcalPer100g: saneNumber(item.kcalPer100g, baseline.kcalPer100g, 10, 650),
    macrosPer100g: {
      protein: saneNumber(macros.protein, baseline.macrosPer100g.protein, 0, 45),
      carbs: saneNumber(macros.carbs, baseline.macrosPer100g.carbs, 0, 90),
      fat: saneNumber(macros.fat, baseline.macrosPer100g.fat, 0, 60)
    },
    nutritionMeta: {
      source: 'ai-food-composition-review',
      basis: item.basis || baseline.nutritionMeta.basis,
      confidence: Math.min(0.86, Math.max(0.45, Number(item.confidence) || 0.66)),
      reviewed: false
    }
  };
}

async function analyzeWithAi(items, baselines, event) {
  const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.MINIMAX_API_KEY;
  if (!token || event.useAI === false) return null;

  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic';
  const model = process.env.ANTHROPIC_MODEL || 'MiniMax-M2.7-highspeed';
  const timeoutMs = Number(process.env.API_TIMEOUT_MS || 30000);
  const prompt = [
    '你是公司食堂营养数据校准助手。',
    '任务：根据中文菜名、品类和本地初估值，给出每100g可食部分的热量、蛋白质、碳水、脂肪。',
    '原则：优先参考常见食物成分表和中式食堂烹饪方式；不确定时保守估算；不要虚构菜品。',
    '输出只要 JSON 数组，每项字段为 name, category, kcalPer100g, macrosPer100g{protein,carbs,fat}, basis, confidence。',
    `菜品：${JSON.stringify(baselines.map(item => ({
      name: item.name,
      category: item.category,
      kcalPer100g: item.kcalPer100g,
      macrosPer100g: item.macrosPer100g,
      basis: item.nutritionMeta && item.nutritionMeta.basis
    })))}`
  ].join('\n');

  const url = `${baseUrl.replace(/\/$/, '')}/v1/messages`;
  const response = await postJson(url, {
    'x-api-key': token,
    authorization: `Bearer ${token}`,
    'anthropic-version': '2023-06-01'
  }, {
    model,
    max_tokens: 4096,
    temperature: 0.15,
    messages: [{ role: 'user', content: prompt }]
  }, timeoutMs);

  const text = Array.isArray(response.content)
    ? response.content.map(part => part.text || '').join('')
    : response.text || '';
  const parsed = parseJsonFromText(text);
  const aiItems = Array.isArray(parsed) ? parsed : parsed.items;
  if (!Array.isArray(aiItems)) return null;

  const baselineByName = {};
  baselines.forEach(item => {
    baselineByName[`${item.name}|${item.category}`] = item;
    baselineByName[item.name] = item;
  });

  const normalized = aiItems
    .map(item => normalizeAiItem(item, baselineByName))
    .filter(Boolean);

  return normalized.length ? normalized : null;
}

exports.main = async event => {
  const dishes = uniqueDishes(flattenDishes(event || {}));
  if (!dishes.length) {
    return { ok: false, error: 'empty_dishes', items: [] };
  }

  const baselines = dishes.map(toBaseline);

  try {
    const aiItems = await analyzeWithAi(dishes, baselines, event || {});
    return {
      ok: true,
      source: aiItems ? 'ai+local-estimator' : 'local-estimator',
      items: aiItems || baselines,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      ok: true,
      source: 'local-estimator',
      warning: error.message,
      items: baselines,
      updatedAt: new Date().toISOString()
    };
  }
};
