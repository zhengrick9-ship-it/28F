const CATEGORY_FALLBACKS = {
  '粥品': { kcal: 58, protein: 2, carbs: 11, fat: 1 },
  '饮品': { kcal: 58, protein: 3, carbs: 6, fat: 2 },
  '汤品': { kcal: 42, protein: 3, carbs: 4, fat: 2 },
  '水果': { kcal: 48, protein: 1, carbs: 12, fat: 0 },
  '小吃': { kcal: 255, protein: 6, carbs: 38, fat: 9 },
  '蛋类': { kcal: 155, protein: 13, carbs: 1, fat: 11 },
  '粗粮': { kcal: 96, protein: 2, carbs: 21, fat: 1 },
  '养生蔬菜': { kcal: 56, protein: 2, carbs: 8, fat: 2 },
  '素菜': { kcal: 72, protein: 3, carbs: 9, fat: 3 },
  '西点': { kcal: 315, protein: 7, carbs: 43, fat: 13 },
  '主食': { kcal: 175, protein: 5, carbs: 35, fat: 2 },
  '面食': { kcal: 135, protein: 5, carbs: 27, fat: 1 },
  '堂烹面臊': { kcal: 205, protein: 12, carbs: 7, fat: 14 },
  '特色套餐': { kcal: 175, protein: 10, carbs: 18, fat: 7 },
  '特色菜': { kcal: 185, protein: 13, carbs: 9, fat: 10 },
  '荤菜': { kcal: 198, protein: 14, carbs: 7, fat: 12 }
};

const DIRECT_DISHES = [
  ['白米饭', 116, 3, 26, 0],
  ['小米蒸饭', 118, 3, 25, 1],
  ['玉米碎米饭', 120, 3, 25, 1],
  ['扬州炒饭', 175, 6, 27, 6],
  ['芽菜肉末炒饭', 178, 7, 27, 6],
  ['面条', 137, 5, 27, 1],
  ['米线', 109, 2, 25, 0],
  ['抄手', 210, 9, 25, 8],
  ['白水蛋', 143, 13, 1, 10],
  ['煎鸡蛋', 198, 14, 1, 15],
  ['卤鸡蛋', 160, 13, 2, 11],
  ['纯牛奶', 65, 3, 5, 4],
  ['原味豆浆', 33, 3, 2, 2],
  ['核桃花生豆浆', 58, 4, 5, 3],
  ['黑豆豆浆', 45, 4, 3, 2],
  ['黑芝麻豆浆', 57, 4, 5, 3],
  ['蒸玉米', 112, 4, 24, 1],
  ['蒸红薯', 90, 1, 21, 0],
  ['蒸贝贝南瓜', 70, 2, 16, 0],
  ['蒸小土豆', 78, 2, 17, 0],
  ['蒸山药', 57, 2, 12, 0],
  ['小番茄', 22, 1, 5, 0],
  ['哈密瓜', 34, 1, 8, 0],
  ['橙子', 48, 1, 12, 0],
  ['不知火', 50, 1, 12, 0],
  ['血橙', 50, 1, 12, 0],
  ['南瓜粥', 47, 1, 10, 0],
  ['红薯粥', 52, 1, 12, 0],
  ['薏仁粥', 62, 2, 13, 1],
  ['八宝粥', 76, 2, 15, 1],
  ['红豆粥', 61, 2, 13, 0],
  ['蔬菜粥', 43, 1, 9, 0],
  ['番茄炒鸡蛋', 112, 6, 5, 7],
  ['红糖醪糟蛋', 132, 7, 16, 5],
  ['麻婆豆腐', 143, 9, 7, 9],
  ['宫保鸡丁', 188, 13, 10, 10],
  ['鱼香肉丝', 182, 12, 12, 9],
  ['青椒肉丝', 172, 13, 7, 10],
  ['土豆回锅肉', 230, 9, 12, 17],
  ['莲白回锅肉', 236, 9, 9, 18],
  ['苕皮回锅肉', 270, 8, 18, 18],
  ['水煮肉片', 208, 14, 6, 14],
  ['卤肉饭', 198, 9, 24, 8],
  ['咖喱鸡盖饭', 174, 9, 23, 6],
  ['豆汤饭', 141, 7, 21, 3],
  ['杂酱', 214, 11, 10, 15],
  ['豌杂', 205, 12, 12, 12],
  ['鸡丝凉面', 190, 10, 24, 7],
  ['香煎大虾凉面', 172, 11, 21, 6],
  ['香煎土豆虾仁沙拉', 132, 8, 12, 5],
  ['泸州荤豆花', 154, 12, 5, 8],
  ['粗粮狮子头', 218, 11, 14, 13],
  ['红烧排骨', 252, 17, 4, 19],
  ['红烧牛肉', 198, 19, 4, 11],
  ['红烧肥肠', 245, 11, 5, 20],
  ['冬菜肉末', 178, 12, 6, 11],
  ['番茄鸡蛋', 116, 7, 6, 7],
  ['素椒牛肉', 188, 19, 5, 10],
  ['姜辣鸭', 232, 16, 4, 17],
  ['鸡杂', 152, 18, 4, 7],
  ['青花椒鱼', 136, 17, 3, 5],
  ['盐焗鸡', 196, 20, 1, 12],
  ['钵钵鸡', 182, 17, 5, 10],
  ['芋儿鸡', 203, 14, 10, 12],
  ['芋儿烧排骨', 215, 15, 9, 14],
  ['红糖糍粑', 258, 4, 50, 5],
  ['紫薯饼', 230, 5, 39, 6],
  ['肉夹馍', 260, 11, 31, 10],
  ['南瓜发糕', 210, 5, 43, 3],
  ['美心紫薯酥', 330, 5, 42, 16],
  ['马拉盏', 286, 7, 38, 11],
  ['奶香玉米球', 238, 5, 34, 9]
].map(toFood);

const INGREDIENTS = [
  ['牛腩', 210, 19, 1, 14],
  ['牛肉', 185, 20, 2, 11],
  ['牛柳', 170, 20, 3, 9],
  ['排骨', 235, 18, 2, 17],
  ['龙骨', 210, 17, 1, 15],
  ['肘子', 260, 18, 1, 20],
  ['蹄花', 245, 18, 2, 18],
  ['鸡脚', 215, 20, 3, 14],
  ['鸡丁', 165, 18, 5, 8],
  ['鸡杂', 150, 18, 4, 7],
  ['鸡', 172, 18, 3, 9],
  ['鸭', 235, 16, 1, 18],
  ['鹅', 250, 17, 1, 19],
  ['兔', 170, 20, 2, 8],
  ['鱼片', 118, 18, 2, 4],
  ['乌鱼', 112, 18, 2, 3],
  ['钳鱼', 125, 17, 2, 5],
  ['三角峰', 118, 17, 2, 4],
  ['虾仁', 99, 19, 2, 1],
  ['大虾', 105, 19, 2, 2],
  ['花甲', 72, 11, 3, 1],
  ['肥肠', 240, 11, 4, 20],
  ['白肉', 290, 13, 1, 26],
  ['回锅肉', 285, 12, 5, 24],
  ['小炒肉', 260, 13, 6, 20],
  ['红烧肉', 330, 10, 7, 30],
  ['肉丝', 175, 13, 5, 10],
  ['肉片', 170, 13, 5, 10],
  ['肉末', 185, 12, 5, 12],
  ['肉沫', 185, 12, 5, 12],
  ['肉丁', 180, 13, 6, 10],
  ['肉包', 238, 9, 34, 7],
  ['酱肉包', 250, 10, 33, 8],
  ['馒头', 225, 7, 48, 1],
  ['花卷', 235, 7, 46, 3],
  ['吐司', 285, 8, 49, 7],
  ['面包', 295, 8, 48, 9],
  ['蛋糕', 325, 6, 42, 15],
  ['桃酥', 430, 6, 55, 21],
  ['麻薯', 300, 3, 62, 5],
  ['软欧', 285, 8, 49, 7],
  ['豆腐', 95, 8, 5, 5],
  ['豆干', 150, 16, 7, 8],
  ['千叶豆腐', 155, 10, 8, 9],
  ['鸡蛋干', 155, 13, 5, 8],
  ['豆筋', 175, 18, 9, 8],
  ['青豆', 95, 6, 12, 3],
  ['豌豆', 105, 7, 15, 2],
  ['豆芽', 45, 4, 5, 1],
  ['无筋豆', 38, 2, 6, 1],
  ['空心菜', 42, 3, 5, 1],
  ['瓢儿白', 36, 2, 4, 1],
  ['生菜', 25, 1, 3, 1],
  ['汉菜', 38, 3, 5, 1],
  ['瓜条', 32, 1, 5, 1],
  ['三丝', 68, 2, 9, 3],
  ['红萝卜', 45, 1, 9, 1],
  ['豇豆', 58, 3, 8, 2],
  ['丝瓜', 35, 1, 5, 1],
  ['紫菜', 35, 5, 4, 0],
  ['蛋花', 78, 6, 2, 5],
  ['血旺', 55, 7, 2, 2],
  ['水晶粉', 168, 0, 39, 0],
  ['粉条', 145, 0, 34, 0],
  ['月牙骨', 238, 15, 2, 17],
  ['肝腰', 170, 19, 4, 8],
  ['巧克力', 520, 6, 58, 30],
  ['狮子头', 230, 12, 11, 15],
  ['土豆', 90, 2, 18, 2],
  ['苕皮', 170, 1, 39, 1],
  ['粉丝', 155, 0, 37, 0],
  ['河粉', 150, 3, 31, 2],
  ['凉粉', 92, 1, 21, 0],
  ['荞面', 118, 4, 24, 1],
  ['莲白', 48, 2, 7, 2],
  ['小白菜', 36, 2, 5, 1],
  ['菜心', 40, 2, 5, 2],
  ['凤尾', 38, 2, 4, 2],
  ['油麦菜', 37, 2, 4, 2],
  ['菠菜', 42, 3, 4, 2],
  ['茼蒿', 42, 2, 5, 2],
  ['西兰花', 52, 4, 6, 2],
  ['花菜', 58, 3, 7, 2],
  ['冬瓜', 32, 1, 4, 1],
  ['南瓜', 64, 1, 14, 1],
  ['茄子', 65, 1, 8, 4],
  ['青椒', 42, 1, 6, 2],
  ['土耳瓜', 42, 1, 6, 2],
  ['三月瓜', 42, 1, 6, 2],
  ['青笋', 42, 1, 5, 2],
  ['山药', 70, 2, 14, 1],
  ['藕', 76, 2, 15, 1],
  ['木耳', 45, 2, 7, 1],
  ['海白菜', 38, 2, 6, 1]
].map(toFood);

const COOKING_ADJUSTMENTS = [
  { keys: ['干锅', '干煸', '油渣', '热拌', '红油'], kcal: 1.22, fat: 1.35 },
  { keys: ['回锅', '小炒', '爆炒', '炒'], kcal: 1.12, fat: 1.2 },
  { keys: ['红烧', '烧', '卤', '烤', '煎'], kcal: 1.1, fat: 1.16 },
  { keys: ['水煮', '冒', '泡椒', '香辣', '麻辣'], kcal: 1.08, fat: 1.15 },
  { keys: ['蒜泥', '白灼', '白水', '蒸', '汤', '炖'], kcal: 0.94, fat: 0.86 }
];

function toFood([keyword, kcal, protein, carbs, fat]) {
  return { keyword, kcal, protein, carbs, fat };
}

function round(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function matchedFoods(name, list) {
  return list
    .filter(item => name.includes(item.keyword))
    .sort((a, b) => b.keyword.length - a.keyword.length);
}

function uniqueByKeyword(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.keyword)) return false;
    seen.add(item.keyword);
    return true;
  });
}

function blend(items, fallback) {
  if (!items.length) return fallback;

  const weights = items.map((_, index) => (index === 0 ? 0.62 : 0.38 / Math.max(1, items.length - 1)));
  const totalWeight = weights.reduce((sum, item) => sum + item, 0);
  const base = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  items.forEach((item, index) => {
    const weight = weights[index] / totalWeight;
    base.kcal += item.kcal * weight;
    base.protein += item.protein * weight;
    base.carbs += item.carbs * weight;
    base.fat += item.fat * weight;
  });

  return base;
}

function applyCooking(name, nutrition) {
  const adjustment = COOKING_ADJUSTMENTS.find(item => item.keys.some(key => name.includes(key)));
  if (!adjustment) return nutrition;

  return {
    kcal: nutrition.kcal * adjustment.kcal,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat * adjustment.fat
  };
}

function applyKcalHint(nutrition, kcalHint, confidence) {
  const hint = Number(kcalHint);
  if (!Number.isFinite(hint) || hint < 10 || hint > 650) return nutrition;

  const estimated = Number(nutrition.kcal) || hint;
  const ratio = hint / estimated;
  if (ratio < 0.55 || ratio > 1.8) return nutrition;

  const hintWeight = confidence >= 0.75 ? 0.18 : 0.35;
  const kcal = estimated * (1 - hintWeight) + hint * hintWeight;
  const scale = kcal / Math.max(1, estimated);

  return {
    kcal,
    protein: nutrition.protein,
    carbs: nutrition.carbs * (scale > 1 ? Math.min(scale, 1.18) : Math.max(scale, 0.86)),
    fat: nutrition.fat * (scale > 1 ? Math.min(scale, 1.22) : Math.max(scale, 0.82))
  };
}

function applyCategoryContext(category, nutrition, fallback, matchedCount) {
  if (category === '汤品') {
    const matchedWeight = matchedCount ? 0.28 : 0;
    const fallbackWeight = 1 - matchedWeight;
    return {
      kcal: nutrition.kcal * matchedWeight + fallback.kcal * fallbackWeight,
      protein: nutrition.protein * matchedWeight + fallback.protein * fallbackWeight,
      carbs: nutrition.carbs * matchedWeight + fallback.carbs * fallbackWeight,
      fat: nutrition.fat * matchedWeight + fallback.fat * fallbackWeight
    };
  }

  if ((category === '素菜' || category === '养生蔬菜') && nutrition.kcal > 130) {
    return {
      kcal: nutrition.kcal * 0.72 + fallback.kcal * 0.28,
      protein: nutrition.protein,
      carbs: nutrition.carbs * 0.86,
      fat: nutrition.fat * 0.72 + fallback.fat * 0.28
    };
  }

  return nutrition;
}

function estimateDishNutrition(name, category, kcalHint) {
  const fallback = CATEGORY_FALLBACKS[category] || { kcal: Number(kcalHint) || 120, protein: 5, carbs: 15, fat: 5 };
  const direct = matchedFoods(name, DIRECT_DISHES)[0];
  const ingredients = uniqueByKeyword(matchedFoods(name, INGREDIENTS));
  const matched = direct ? [direct] : ingredients.slice(0, 3);
  const base = direct || blend(matched, fallback);
  const confidence = direct ? 0.78 : (matched.length >= 2 ? 0.62 : (matched.length === 1 ? 0.52 : 0.36));
  const cooked = direct ? base : applyCooking(name, base);
  const contextual = applyCategoryContext(category, cooked, fallback, matched.length);
  const adjusted = applyKcalHint(contextual, kcalHint, confidence);

  return {
    kcalPer100g: round(adjusted.kcal),
    macrosPer100g: {
      protein: round(adjusted.protein),
      carbs: round(adjusted.carbs),
      fat: round(adjusted.fat)
    },
    nutritionMeta: {
      source: direct ? 'dish-name-reference-estimate' : (matched.length ? 'ingredient-keyword-estimate' : 'category-fallback-estimate'),
      basis: direct ? direct.keyword : matched.map(item => item.keyword).join('+') || category,
      confidence,
      reviewed: false
    }
  };
}

module.exports = {
  estimateDishNutrition,
  CATEGORY_FALLBACKS
};
