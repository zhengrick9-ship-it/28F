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

  const direct = value.text || value.content || value.output_text;
  if (typeof direct === 'string') return direct;
  if (direct && typeof direct === 'object') return extractTextFromValue(direct);

  if (Array.isArray(value)) {
    return value.map(item => extractTextFromValue(item)).join('');
  }

  const jsonLike = [];
  Object.keys(value).forEach(key => {
    const text = extractTextFromValue(value[key]);
    if (text) jsonLike.push(text);
  });

  return jsonLike.join('');
}

function findJsonText(value) {
  const candidates = [];

  function walk(item) {
    if (!item) return;
    if (typeof item === 'string') {
      if (item.includes('dishIds') || item.includes('{')) candidates.push(item);
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
  let response;
  try {
    response = await postJson(url, {
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
  } catch (error) {
    return {
      ok: false,
      error: 'ai_request_failed',
      message: String(error.message || error).slice(0, 240),
      model,
      endpoint: baseUrl.replace(/\/$/, '')
    };
  }

  const text = extractResponseText(response) || findJsonText(response);
  let parsed;
  try {
    parsed = parseJsonFromText(text);
  } catch (error) {
    return {
      ok: false,
      error: 'ai_json_parse_failed',
      message: String(error.message || error).slice(0, 240),
      model,
      responseShape: responseShape(response),
      textPreview: text.slice(0, 120)
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
