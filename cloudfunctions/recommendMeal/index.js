const https = require('https');

const MODE_LABELS = {
  balanced: '均衡',
  lowCal: '低卡',
  highProtein: '高蛋白',
  random: '随机'
};

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
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

exports.main = async event => {
  const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.MINIMAX_API_KEY;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic';
  const model = process.env.ANTHROPIC_MODEL || 'MiniMax-M2.7-highspeed';
  const timeoutMs = Number(process.env.API_TIMEOUT_MS || 30000);

  if (!token) {
    return { ok: false, error: 'missing_ai_token' };
  }

  const dishes = Array.isArray(event.dishes) ? event.dishes : [];
  if (!dishes.length) {
    return { ok: false, error: 'empty_dishes' };
  }

  const dishPayload = dishes.map(dish => ({
    id: dish.id,
    name: dish.name,
    category: dish.category,
    kcalPer100g: dish.kcalPer100g,
    macrosPer100g: dish.macrosPer100g
  }));

  const mode = event.mode || 'balanced';
  const modeLabel = MODE_LABELS[mode] || '均衡';
  const prompt = [
    `你是公司食堂点餐推荐助手。请只从给定菜品中推荐 2-4 个菜。`,
    `日期：${event.date || ''} ${event.weekday || ''}`,
    `餐次：${event.mealLabel || event.mealKey || ''}`,
    `推荐模式：${modeLabel}`,
    `要求：`,
    `- 低卡：优先低热量、蔬菜、汤品，少油炸糕点。`,
    `- 高蛋白：优先肉蛋豆制品，兼顾一个主食或蔬菜。`,
    `- 均衡：主食、蛋白、蔬菜/汤/水果尽量搭配。`,
    `- 随机：可以更随意，但仍需能组成一餐。`,
    `- 只能返回菜品 id，不要虚构菜品。`,
    `菜品 JSON：${JSON.stringify(dishPayload)}`,
    `输出严格 JSON：{"dishIds":["id1","id2"],"reason":"一句话说明"}`
  ].join('\n');

  const url = `${baseUrl.replace(/\/$/, '')}/v1/messages`;
  const response = await postJson(url, {
    'x-api-key': token,
    authorization: `Bearer ${token}`,
    'anthropic-version': '2023-06-01'
  }, {
    model,
    max_tokens: 600,
    temperature: mode === 'random' ? 0.9 : 0.35,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  }, timeoutMs);

  const text = Array.isArray(response.content)
    ? response.content.map(part => part.text || '').join('')
    : response.text || '';
  const parsed = parseJsonFromText(text);
  const allowedIds = new Set(dishes.map(dish => dish.id));
  const dishIds = (parsed.dishIds || []).filter(id => allowedIds.has(id)).slice(0, 4);

  return {
    ok: dishIds.length > 0,
    dishIds,
    reason: parsed.reason || `${modeLabel}模式推荐`,
    source: 'AI'
  };
};
