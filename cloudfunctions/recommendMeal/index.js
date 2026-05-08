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
  if (/^"dishIds"\s*:/.test(trimmed)) {
    return JSON.parse(`{${trimmed}`);
  }
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch) return JSON.parse(fenceMatch[1].trim());

    const match = trimmed.match(/\{[\s\S]*?"dishIds"[\s\S]*?\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function extractToolInput(response) {
  let toolInput = null;

  function walk(value) {
    if (!value || toolInput) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value !== 'object') return;

    if (value.type === 'tool_use' && value.name === 'recommend_dishes' && value.input) {
      toolInput = value.input;
      return;
    }

    Object.keys(value).forEach(key => walk(value[key]));
  }

  walk(response);
  return toolInput;
}

function extractResponseText(response) {
  if (!response) return '';

  if (typeof response.content === 'string') {
    return response.content;
  }

  if (Array.isArray(response.content)) {
    return response.content.map(part => extractTextFromValue(part)).join('');
  }

  if (response.output_text) {
    return response.output_text;
  }

  if (Array.isArray(response.choices) && response.choices.length > 0) {
    const choice = response.choices[0];
    if (choice.message && typeof choice.message.content === 'string') {
      return choice.message.content;
    }
    if (typeof choice.text === 'string') {
      return choice.text;
    }
  }

  return response.text || '';
}

function extractTextFromValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';

  if (value.type && value.type !== 'text') {
    return '';
  }

  const direct = value.text || value.content || value.output_text;
  if (typeof direct === 'string') return direct;
  if (direct && typeof direct === 'object') return extractTextFromValue(direct);

  if (Array.isArray(value)) {
    return value.map(item => extractTextFromValue(item)).join('');
  }

  return '';
}

function findJsonText(value) {
  const candidates = [];

  function walk(item) {
    if (!item) return;
    if (typeof item === 'string') {
      const text = item.trim();
      if (text.includes('dishIds') || text.includes('{"') || text.startsWith('{')) candidates.push(text);
      return;
    }
    if (typeof item !== 'object') return;
    if (Array.isArray(item)) {
      item.forEach(walk);
      return;
    }
    Object.keys(item).forEach(key => walk(item[key]));
  }

  walk(value);
  return candidates.find(text => text.includes('dishIds')) || candidates[0] || '';
}

function responseShape(response) {
  if (!response || typeof response !== 'object') return typeof response;
  const shape = {};
  Object.keys(response).slice(0, 12).forEach(key => {
    const value = response[key];
    if (Array.isArray(value)) {
      shape[key] = `array(${value.length})`;
    } else {
      shape[key] = typeof value;
    }
  });
  return shape;
}

function getCategoryType(category) {
  const stapleCats = ['粥品', '主食', '西点', '面食', '饮品'];
  const proteinCats = ['荤菜', '蛋类', '堂烹面臊', '特色菜', '特色套餐'];
  const vegCats = ['素菜', '养生蔬菜', '水果', '汤品', '粗粮'];
  if (stapleCats.includes(category)) return 'staple';
  if (proteinCats.includes(category)) return 'protein';
  if (vegCats.includes(category)) return 'vegetable';
  return 'other';
}

function recommendByRule(dishes, mode) {
  if (mode === 'random') {
    return dishes
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, Math.max(2, dishes.length)))
      .map(dish => dish.id);
  }

  const byType = { staple: [], protein: [], vegetable: [], other: [] };
  dishes.forEach(dish => byType[getCategoryType(dish.category)].push(dish));

  const calories = dish => Number(dish.kcalPer100g) || 0;
  const protein = dish => Number(dish.macrosPer100g && dish.macrosPer100g.protein) || 0;
  const pick = list => list.length ? list[0] : null;
  const picked = [];

  const staplePool = byType.staple.slice().sort((a, b) => calories(a) - calories(b));
  const proteinPool = byType.protein.slice().sort((a, b) => mode === 'highProtein' ? protein(b) - protein(a) : calories(a) - calories(b));
  const vegPool = byType.vegetable.slice().sort((a, b) => calories(a) - calories(b));

  if (mode !== 'lowCal') {
    const staple = pick(staplePool);
    if (staple) picked.push(staple);
  }

  const mainProtein = pick(proteinPool);
  const vegetable = pick(vegPool);
  if (mainProtein) picked.push(mainProtein);
  if (vegetable) picked.push(vegetable);

  if (picked.length < 3 && mode !== 'lowCal') {
    const nextProtein = proteinPool.find(dish => !picked.includes(dish));
    if (nextProtein) picked.push(nextProtein);
  }

  if (mode === 'lowCal') {
    return dishes
      .slice()
      .sort((a, b) => calories(a) - calories(b))
      .slice(0, Math.min(3, dishes.length))
      .map(dish => dish.id);
  }

  return picked.slice(0, 4).map(dish => dish.id);
}

exports.main = async event => {
  const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.MINIMAX_API_KEY;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic';
  const model = process.env.ANTHROPIC_MODEL || 'MiniMax-M2.7-highspeed';
  const timeoutMs = Number(process.env.API_TIMEOUT_MS || 30000);
  const maxTokens = Number(process.env.AI_MAX_TOKENS || 2048);

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
  const currentRecommendation = Array.isArray(event.currentRecommendation) ? event.currentRecommendation : [];
  const userMessage = event.userMessage || '';
  const prompt = [
    `你是公司食堂点餐推荐助手。请调用 recommend_dishes 工具返回推荐。`,
    `日期：${event.date || ''} ${event.weekday || ''}`,
    `餐次：${event.mealLabel || event.mealKey || ''}`,
    `推荐模式：${modeLabel}`,
    userMessage ? `用户追问：${userMessage}` : '',
    currentRecommendation.length ? `当前推荐菜品 JSON：${JSON.stringify(currentRecommendation)}` : '',
    `低卡优先低热量、蔬菜、汤品；高蛋白优先肉蛋豆制品；均衡兼顾主食、蛋白、蔬菜；随机可更随意。`,
    userMessage ? `如果用户表达不想吃某道菜，请避开该菜并换成同餐次其他合适菜品。` : '',
    `只能使用菜品 JSON 中存在的 id，不要虚构菜品。`,
    `菜品 JSON：${JSON.stringify(dishPayload)}`
  ].filter(Boolean).join('\n');

  const url = `${baseUrl.replace(/\/$/, '')}/v1/messages`;
  let response;
  try {
    response = await postJson(url, {
      'x-api-key': token,
      authorization: `Bearer ${token}`,
      'anthropic-version': '2023-06-01'
    }, {
      model,
      max_tokens: maxTokens,
      temperature: mode === 'random' ? 0.9 : 0.35,
      tools: [
        {
          name: 'recommend_dishes',
          description: 'Return cafeteria dish ids and a short Chinese reason.',
          input_schema: {
            type: 'object',
            properties: {
              dishIds: {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
                maxItems: 4
              },
              reason: {
                type: 'string'
              }
            },
            required: ['dishIds', 'reason']
          }
        }
      ],
      tool_choice: {
        type: 'tool',
        name: 'recommend_dishes'
      },
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, timeoutMs);
  } catch (error) {
    return {
      ok: false,
      error: 'ai_request_failed',
      message: String(error.message || error).slice(0, 240),
      model,
      endpoint: baseUrl.replace(/\/$/, '')
    };
  }

  const toolInput = extractToolInput(response);
  const rawText = toolInput ? JSON.stringify(toolInput) : (findJsonText(response) || extractResponseText(response));
  const text = /^"dishIds"\s*:/.test(rawText.trim()) ? `{${rawText.trim()}` : rawText;
  let parsed;
  try {
    parsed = parseJsonFromText(text);
  } catch (error) {
    const ruleDishIds = recommendByRule(dishes, mode);
    return {
      ok: ruleDishIds.length > 0,
      error: 'ai_json_parse_failed',
      message: String(error.message || error).slice(0, 240),
      model,
      responseShape: responseShape(response),
      stopReason: response && response.stop_reason,
      textPreview: text.slice(0, 120),
      dishIds: ruleDishIds,
      reason: `${modeLabel}模式推荐；AI 返回格式异常，已用云端规则兜底`,
      source: '云端推荐'
    };
  }
  const allowedIds = new Set(dishes.map(dish => dish.id));
  const dishIds = (parsed.dishIds || []).filter(id => allowedIds.has(id)).slice(0, 4);

  return {
    ok: dishIds.length > 0,
    dishIds,
    reason: parsed.reason || `${modeLabel}模式推荐`,
    source: 'AI',
    model
  };
};
