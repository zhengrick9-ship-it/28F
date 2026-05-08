const mealLabels = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐'
};

const weekdayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const { estimateDishNutrition, CATEGORY_FALLBACKS } = require('./nutrition');

function d(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function macroProfile(category, name, kcalHint) {
  return estimateDishNutrition(name || category, category, kcalHint).macrosPer100g;
}

function dish(id, name, category, kcalPer100g) {
  return { id, name, category, ...estimateDishNutrition(name, category, kcalPer100g) };
}

function dishList(prefix, category, names, kcalPer100g) {
  return names.map((name, index) => dish(`${prefix}-${index + 1}`, name, category, kcalPer100g));
}

// Week 1: 2026-04-20 to 2026-04-24
const week1 = {
  label: '4.20-4.24',
  startDate: d(2026, 4, 20),
  endDate: d(2026, 4, 24),
  days: [
    {
      date: d(2026, 4, 20),
      weekday: '周一',
      weekdayIndex: 0,
      meals: {
        breakfast: [
          dish('w1-mon-b-1', '南瓜粥', '粥品', 55),
          dish('w1-mon-b-2', '大葱肉包', '主食', 240),
          dish('w1-mon-b-3', '南瓜馒头', '主食', 230),
          dish('w1-mon-b-4', '椒盐花卷', '主食', 235),
          dish('w1-mon-b-5', '提子吐司', '西点', 290),
          dish('w1-mon-b-6', '虎皮蛋糕', '西点', 340),
          dish('w1-mon-b-7', '煎鸡蛋', '蛋类', 165),
          dish('w1-mon-b-8', '白水蛋', '蛋类', 145),
          dish('w1-mon-b-9', '山椒木耳', '养生蔬菜', 45),
          dish('w1-mon-b-10', '青椒茄子', '养生蔬菜', 55),
          dish('w1-mon-b-11', '韭菜炒豆芽', '养生蔬菜', 50),
          dish('w1-mon-b-12', '炒小白菜', '养生蔬菜', 35),
          dish('w1-mon-b-13', '蒸贝贝南瓜', '粗粮', 85),
          dish('w1-mon-b-14', '原味豆浆', '饮品', 48),
          dish('w1-mon-b-15', '纯牛奶', '饮品', 65),
          dish('w1-mon-b-16', '红烧排骨', '堂烹面臊', 220),
          dish('w1-mon-b-17', '杂酱', '堂烹面臊', 200),
          dish('w1-mon-b-18', '面2款', '面食', 135),
          dish('w1-mon-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w1-mon-l-1', '泡菜钳鱼', '特色菜', 165),
          dish('w1-mon-l-2', '钵钵鸡', '荤菜', 195),
          dish('w1-mon-l-3', '莲白回锅肉', '荤菜', 260),
          dish('w1-mon-l-4', '青笋榨菜肉丝', '荤菜', 185),
          dish('w1-mon-l-5', '脆哨蒸蛋', '荤菜', 155),
          dish('w1-mon-l-6', '荷兰豆炒山药', '素菜', 75),
          dish('w1-mon-l-7', '白水无筋豆', '素菜', 55),
          dish('w1-mon-l-8', '炒空心菜', '素菜', 40),
          dish('w1-mon-l-9', '不知火', '水果', 50),
          dish('w1-mon-l-10', '紫薯饼', '小吃', 245),
          dish('w1-mon-l-11', '冬瓜棒子骨汤', '汤品', 45),
          dish('w1-mon-l-12', '小米蒸饭', '主食', 145),
          dish('w1-mon-l-13', '面条', '主食', 135),
          dish('w1-mon-l-14', '白米饭', '主食', 145),
          dish('w1-mon-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w1-mon-d-1', '香煎大虾凉面', '特色套餐', 175),
          dish('w1-mon-d-2', '冒烤鸭', '荤菜', 240),
          dish('w1-mon-d-3', '鸡丝凉面', '荤菜', 195),
          dish('w1-mon-d-4', '青椒地瓜', '素菜', 70),
          dish('w1-mon-d-5', '姜汁菠菜', '素菜', 45),
          dish('w1-mon-d-6', '面2款', '面食', 135),
          dish('w1-mon-d-7', '粉2款', '面食', 130)
        ]
      }
    },
    {
      date: d(2026, 4, 21),
      weekday: '周二',
      weekdayIndex: 1,
      meals: {
        breakfast: [
          dish('w1-tue-b-1', '红薯粥', '粥品', 58),
          dish('w1-tue-b-2', '豇豆肉包', '主食', 242),
          dish('w1-tue-b-3', '白面馒头', '主食', 225),
          dish('w1-tue-b-4', '肉松花卷', '主食', 250),
          dish('w1-tue-b-5', '香蕉蛋糕', '西点', 320),
          dish('w1-tue-b-6', '宫廷桃酥', '西点', 380),
          dish('w1-tue-b-7', '卤鸡蛋', '蛋类', 155),
          dish('w1-tue-b-8', '白水蛋', '蛋类', 145),
          dish('w1-tue-b-9', '青笋折耳根', '养生蔬菜', 50),
          dish('w1-tue-b-10', '炒三月瓜', '养生蔬菜', 40),
          dish('w1-tue-b-11', '泡椒藕片', '养生蔬菜', 55),
          dish('w1-tue-b-12', '炒瓢儿白', '养生蔬菜', 35),
          dish('w1-tue-b-13', '蒸玉米', '粗粮', 105),
          dish('w1-tue-b-14', '核桃花生豆浆', '饮品', 58),
          dish('w1-tue-b-15', '纯牛奶', '饮品', 65),
          dish('w1-tue-b-16', '红烧牛肉', '堂烹面臊', 210),
          dish('w1-tue-b-17', '冬菜肉末', '堂烹面臊', 195),
          dish('w1-tue-b-18', '面2款', '面食', 135),
          dish('w1-tue-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w1-tue-l-1', '萝卜烧牛腩', '特色菜', 175),
          dish('w1-tue-l-2', '干锅月牙骨', '荤菜', 245),
          dish('w1-tue-l-3', '宫保鸡丁', '荤菜', 185),
          dish('w1-tue-l-4', '韭菜豆干肉丝', '荤菜', 180),
          dish('w1-tue-l-5', '干捞水晶粉', '荤菜', 165),
          dish('w1-tue-l-6', '小炒花菜', '素菜', 65),
          dish('w1-tue-l-7', '沾水茄子', '素菜', 85),
          dish('w1-tue-l-8', '炒凤尾', '素菜', 40),
          dish('w1-tue-l-9', '小番茄', '水果', 38),
          dish('w1-tue-l-10', '南瓜流心球', '小吃', 260),
          dish('w1-tue-l-11', '紫菜蛋花汤', '汤品', 35),
          dish('w1-tue-l-12', '芽菜肉末炒饭', '主食', 165),
          dish('w1-tue-l-13', '面条', '主食', 135),
          dish('w1-tue-l-14', '白米饭', '主食', 145),
          dish('w1-tue-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w1-tue-d-1', '咖喱鸡盖饭', '特色套餐', 170),
          dish('w1-tue-d-2', '青笋烧肘子', '荤菜', 255),
          dish('w1-tue-d-3', '腊肉豌豆', '荤菜', 190),
          dish('w1-tue-d-4', '白油冬瓜', '素菜', 35),
          dish('w1-tue-d-5', '蒜泥生菜', '素菜', 40),
          dish('w1-tue-d-6', '面2款', '面食', 135),
          dish('w1-tue-d-7', '粉2款', '面食', 130)
        ]
      }
    },
    {
      date: d(2026, 4, 22),
      weekday: '周三',
      weekdayIndex: 2,
      meals: {
        breakfast: [
          dish('w1-wed-b-1', '薏仁粥', '粥品', 62),
          dish('w1-wed-b-2', '鲜肉包', '主食', 238),
          dish('w1-wed-b-3', '麦麸馒头', '主食', 228),
          dish('w1-wed-b-4', '葱花花卷', '主食', 232),
          dish('w1-wed-b-5', '榛果巧克力', '西点', 360),
          dish('w1-wed-b-6', '蔓越莓蛋糕', '西点', 330),
          dish('w1-wed-b-7', '煎鸡蛋', '蛋类', 165),
          dish('w1-wed-b-8', '白水蛋', '蛋类', 145),
          dish('w1-wed-b-9', '香菜鸡蛋干', '养生蔬菜', 80),
          dish('w1-wed-b-10', '干煸茄子', '养生蔬菜', 75),
          dish('w1-wed-b-11', '虎皮青椒', '养生蔬菜', 55),
          dish('w1-wed-b-12', '炒菠菜', '养生蔬菜', 40),
          dish('w1-wed-b-13', '蒸红薯', '粗粮', 90),
          dish('w1-wed-b-14', '黑豆豆浆', '饮品', 52),
          dish('w1-wed-b-15', '纯牛奶', '饮品', 65),
          dish('w1-wed-b-16', '酸菜肉丝', '堂烹面臊', 185),
          dish('w1-wed-b-17', '豌杂', '堂烹面臊', 205),
          dish('w1-wed-b-18', '面2款', '面食', 135),
          dish('w1-wed-b-19', '粉2款', '面食', 130),
          dish('w1-wed-b-20', '抄手', '面食', 155)
        ],
        lunch: [
          dish('w1-wed-l-1', '盐焗鸡', '特色菜', 195),
          dish('w1-wed-l-2', '土豆烧排骨', '荤菜', 210),
          dish('w1-wed-l-3', '青椒盐煎肉', '荤菜', 275),
          dish('w1-wed-l-4', '蒜苔肉丝', '荤菜', 185),
          dish('w1-wed-l-5', '肉末青豆绘丝瓜', '荤菜', 140),
          dish('w1-wed-l-6', '川北凉粉', '素菜', 95),
          dish('w1-wed-l-7', '油渣莲白', '素菜', 110),
          dish('w1-wed-l-8', '炒菜心', '素菜', 42),
          dish('w1-wed-l-9', '血橙', '水果', 55),
          dish('w1-wed-l-10', '马拉盏', '小吃', 280),
          dish('w1-wed-l-11', '萝卜龙骨汤', '汤品', 55),
          dish('w1-wed-l-12', '玉米碎米饭', '主食', 148),
          dish('w1-wed-l-13', '白米饭', '主食', 145),
          dish('w1-wed-l-14', '面条', '主食', 135),
          dish('w1-wed-l-15', '米线', '主食', 125),
          dish('w1-wed-l-16', '抄手', '主食', 155)
        ],
        dinner: [
          dish('w1-wed-d-1', '青椒回锅肉', '荤菜', 270),
          dish('w1-wed-d-2', '泡椒鸡杂', '荤菜', 185),
          dish('w1-wed-d-3', '豆芽炒粉条', '素菜', 95),
          dish('w1-wed-d-4', '油麦菜', '素菜', 38),
          dish('w1-wed-d-5', '面2款', '面食', 135),
          dish('w1-wed-d-6', '粉2款', '面食', 130),
          dish('w1-wed-d-7', '抄手', '面食', 155)
        ]
      }
    },
    {
      date: d(2026, 4, 23),
      weekday: '周四',
      weekdayIndex: 3,
      meals: {
        breakfast: [
          dish('w1-thu-b-1', '八宝粥', '粥品', 68),
          dish('w1-thu-b-2', '芽菜肉包', '主食', 240),
          dish('w1-thu-b-3', '玉米馒头', '主食', 232),
          dish('w1-thu-b-4', '黑芝麻花卷', '主食', 238),
          dish('w1-thu-b-5', '蒸蛋糕', '西点', 295),
          dish('w1-thu-b-6', '原味麻薯', '西点', 310),
          dish('w1-thu-b-7', '红糖醪糟蛋', '蛋类', 140),
          dish('w1-thu-b-8', '白水蛋', '蛋类', 145),
          dish('w1-thu-b-9', '洋葱黑木耳', '养生蔬菜', 55),
          dish('w1-thu-b-10', '卤豆筋', '养生蔬菜', 120),
          dish('w1-thu-b-11', '泡椒青笋', '养生蔬菜', 45),
          dish('w1-thu-b-12', '炒下锅耙', '养生蔬菜', 40),
          dish('w1-thu-b-13', '蒸小土豆', '粗粮', 75),
          dish('w1-thu-b-14', '黑芝麻豆浆', '饮品', 56),
          dish('w1-thu-b-15', '纯牛奶', '饮品', 65),
          dish('w1-thu-b-16', '鸡杂', '堂烹面臊', 180),
          dish('w1-thu-b-17', '杂酱', '堂烹面臊', 200),
          dish('w1-thu-b-18', '面2款', '面食', 135),
          dish('w1-thu-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w1-thu-l-1', '鹌鹑蛋红烧肉', '特色菜', 265),
          dish('w1-thu-l-2', '芋儿耙鸡脚', '荤菜', 215),
          dish('w1-thu-l-3', '鱼香肉丝', '荤菜', 180),
          dish('w1-thu-l-4', '青笋木耳肉片', '荤菜', 165),
          dish('w1-thu-l-5', '肝腰合炒', '荤菜', 175),
          dish('w1-thu-l-6', '泡椒三月瓜丝', '素菜', 50),
          dish('w1-thu-l-7', '酸菜血旺', '素菜', 85),
          dish('w1-thu-l-8', '炒瓢儿白', '素菜', 38),
          dish('w1-thu-l-9', '不知火', '水果', 50),
          dish('w1-thu-l-10', '美心紫薯酥', '小吃', 290),
          dish('w1-thu-l-11', '绿豆南瓜汤', '汤品', 48),
          dish('w1-thu-l-12', '扬州炒饭', '主食', 170),
          dish('w1-thu-l-13', '面条', '主食', 135),
          dish('w1-thu-l-14', '白米饭', '主食', 145),
          dish('w1-thu-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w1-thu-d-1', '泸州荤豆花', '特色套餐', 155),
          dish('w1-thu-d-2', '青花椒鱼', '荤菜', 145),
          dish('w1-thu-d-3', '番茄炒鸡蛋', '荤菜', 110),
          dish('w1-thu-d-4', '炝拌藕丁', '素菜', 75),
          dish('w1-thu-d-5', '炒空心菜', '素菜', 40),
          dish('w1-thu-d-6', '面2款', '面食', 135),
          dish('w1-thu-d-7', '粉2款', '面食', 130)
        ]
      }
    },
    {
      date: d(2026, 4, 24),
      weekday: '周五',
      weekdayIndex: 4,
      meals: {
        breakfast: [
          dish('w1-fri-b-1', '红豆粥', '粥品', 60),
          dish('w1-fri-b-2', '酱肉包', '主食', 250),
          dish('w1-fri-b-3', '白面馒头', '主食', 225),
          dish('w1-fri-b-4', '椒盐花卷', '主食', 235),
          dish('w1-fri-b-5', '蔓越莓软欧', '西点', 285),
          dish('w1-fri-b-6', '纸杯蛋糕', '西点', 325),
          dish('w1-fri-b-7', '煎鸡蛋', '蛋类', 165),
          dish('w1-fri-b-8', '白水蛋', '蛋类', 145),
          dish('w1-fri-b-9', '小炒土豆片', '养生蔬菜', 80),
          dish('w1-fri-b-10', '红油三丝', '养生蔬菜', 70),
          dish('w1-fri-b-11', '蒜苗红萝卜片', '养生蔬菜', 50),
          dish('w1-fri-b-12', '炒菜心', '养生蔬菜', 42),
          dish('w1-fri-b-13', '蒸山药', '粗粮', 55),
          dish('w1-fri-b-14', '花生核桃豆浆', '饮品', 60),
          dish('w1-fri-b-15', '纯牛奶', '饮品', 65),
          dish('w1-fri-b-16', '红烧肥肠', '堂烹面臊', 235),
          dish('w1-fri-b-17', '杂酱', '堂烹面臊', 200),
          dish('w1-fri-b-18', '面2款', '面食', 135),
          dish('w1-fri-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w1-fri-l-1', '广式烤鹅', '特色菜', 240),
          dish('w1-fri-l-2', '海带雪豆炖蹄花', '荤菜', 195),
          dish('w1-fri-l-3', '热拌白肉', '荤菜', 280),
          dish('w1-fri-l-4', '农家小炒肉', '荤菜', 245),
          dish('w1-fri-l-5', '烂肉豇豆', '荤菜', 170),
          dish('w1-fri-l-6', '蜜汁老南瓜', '素菜', 75),
          dish('w1-fri-l-7', '蒜蓉西兰花', '素菜', 55),
          dish('w1-fri-l-8', '炒小白菜', '素菜', 38),
          dish('w1-fri-l-9', '小番茄', '水果', 38),
          dish('w1-fri-l-10', '南瓜发糕', '小吃', 225),
          dish('w1-fri-l-11', '丝瓜滑肉汤', '汤品', 55),
          dish('w1-fri-l-12', '小米蒸饭', '主食', 145),
          dish('w1-fri-l-13', '面条', '主食', 135),
          dish('w1-fri-l-14', '白米饭', '主食', 145),
          dish('w1-fri-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w1-fri-d-1', '芋儿鸡', '荤菜', 210),
          dish('w1-fri-d-2', '青椒肉丝', '荤菜', 185),
          dish('w1-fri-d-3', '糖醋莲白', '素菜', 75),
          dish('w1-fri-d-4', '炒菜心', '素菜', 42),
          dish('w1-fri-d-5', '面2款', '面食', 135),
          dish('w1-fri-d-6', '粉2款', '面食', 130)
        ]
      }
    }
  ]
};

// Week 2: 2026-04-27 to 2026-04-30 (default)
const week2 = {
  label: '4.27-4.30',
  startDate: d(2026, 4, 27),
  endDate: d(2026, 4, 30),
  days: [
    {
      date: d(2026, 4, 27),
      weekday: '周一',
      weekdayIndex: 0,
      meals: {
        breakfast: [
          dish('w2-mon-b-1', '南瓜粥', '粥品', 55),
          dish('w2-mon-b-2', '芽菜肉包', '主食', 240),
          dish('w2-mon-b-3', '南瓜馒头', '主食', 230),
          dish('w2-mon-b-4', '椒盐花卷', '主食', 235),
          dish('w2-mon-b-5', '红豆吐司', '西点', 285),
          dish('w2-mon-b-6', '海苔蛋糕', '西点', 310),
          dish('w2-mon-b-7', '煎鸡蛋', '蛋类', 165),
          dish('w2-mon-b-8', '白水蛋', '蛋类', 145),
          dish('w2-mon-b-9', '糊辣瓜条', '养生蔬菜', 40),
          dish('w2-mon-b-10', '韭菜炒河粉', '养生蔬菜', 110),
          dish('w2-mon-b-11', '炒莲白', '养生蔬菜', 50),
          dish('w2-mon-b-12', '炒小白菜', '养生蔬菜', 35),
          dish('w2-mon-b-13', '蒸贝贝南瓜', '粗粮', 85),
          dish('w2-mon-b-14', '原味豆浆', '饮品', 48),
          dish('w2-mon-b-15', '纯牛奶', '饮品', 65),
          dish('w2-mon-b-16', '红烧排骨', '堂烹面臊', 220),
          dish('w2-mon-b-17', '杂酱', '堂烹面臊', 200),
          dish('w2-mon-b-18', '面2款', '面食', 135),
          dish('w2-mon-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w2-mon-l-1', '豆花牛柳', '特色菜', 175),
          dish('w2-mon-l-2', '老妈兔丁', '荤菜', 195),
          dish('w2-mon-l-3', '鸡米芽菜', '荤菜', 185),
          dish('w2-mon-l-4', '韭黄肉丝', '荤菜', 180),
          dish('w2-mon-l-5', '黄瓜木耳肉片', '荤菜', 160),
          dish('w2-mon-l-6', '干煸无筋豆', '素菜', 85),
          dish('w2-mon-l-7', '葱香土豆泥', '素菜', 95),
          dish('w2-mon-l-8', '蒜泥茼蒿', '素菜', 42),
          dish('w2-mon-l-9', '小番茄', '水果', 38),
          dish('w2-mon-l-10', '奶香玉米球', '小吃', 240),
          dish('w2-mon-l-11', '冬瓜带丝汤', '汤品', 30),
          dish('w2-mon-l-12', '小米蒸饭', '主食', 145),
          dish('w2-mon-l-13', '面条', '主食', 135),
          dish('w2-mon-l-14', '白米饭', '主食', 145),
          dish('w2-mon-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w2-mon-d-1', '香煎土豆虾仁沙拉', '特色套餐', 140),
          dish('w2-mon-d-2', '青椒花甲鸡', '荤菜', 175),
          dish('w2-mon-d-3', '鱼香肉丝', '荤菜', 180),
          dish('w2-mon-d-4', '小炒千叶豆腐', '素菜', 110),
          dish('w2-mon-d-5', '炒油麦菜', '素菜', 38),
          dish('w2-mon-d-6', '面2款', '面食', 135),
          dish('w2-mon-d-7', '粉2款', '面食', 130)
        ]
      }
    },
    {
      date: d(2026, 4, 28),
      weekday: '周二',
      weekdayIndex: 1,
      meals: {
        breakfast: [
          dish('w2-tue-b-1', '蔬菜粥', '粥品', 50),
          dish('w2-tue-b-2', '鲜肉包', '主食', 238),
          dish('w2-tue-b-3', '白面馒头', '主食', 225),
          dish('w2-tue-b-4', '肉松花卷', '主食', 250),
          dish('w2-tue-b-5', '香橙蛋糕', '西点', 315),
          dish('w2-tue-b-6', '奶香馒头面包', '西点', 265),
          dish('w2-tue-b-7', '卤鸡蛋', '蛋类', 155),
          dish('w2-tue-b-8', '白水蛋', '蛋类', 145),
          dish('w2-tue-b-9', '泡椒海白菜', '养生蔬菜', 45),
          dish('w2-tue-b-10', '炒野鸡红', '养生蔬菜', 70),
          dish('w2-tue-b-11', '小炒土豆片', '养生蔬菜', 80),
          dish('w2-tue-b-12', '蒜泥汉菜', '养生蔬菜', 40),
          dish('w2-tue-b-13', '蒸玉米', '粗粮', 105),
          dish('w2-tue-b-14', '核桃花生豆浆', '饮品', 58),
          dish('w2-tue-b-15', '纯牛奶', '饮品', 65),
          dish('w2-tue-b-16', '红烧牛肉', '堂烹面臊', 210),
          dish('w2-tue-b-17', '番茄鸡蛋', '堂烹面臊', 120),
          dish('w2-tue-b-18', '面2款', '面食', 135),
          dish('w2-tue-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w2-tue-l-1', '小土豆烧肥肠', '特色菜', 255),
          dish('w2-tue-l-2', '酸汤乌鱼片', '荤菜', 135),
          dish('w2-tue-l-3', '螺丝椒小炒肉', '荤菜', 265),
          dish('w2-tue-l-4', '泡椒鸡丁', '荤菜', 175),
          dish('w2-tue-l-5', '番茄炒鸡蛋', '荤菜', 110),
          dish('w2-tue-l-6', '虾米冬瓜', '素菜', 50),
          dish('w2-tue-l-7', '蒜蓉西兰花', '素菜', 55),
          dish('w2-tue-l-8', '炒瓢儿白', '素菜', 38),
          dish('w2-tue-l-9', '橙子', '水果', 48),
          dish('w2-tue-l-10', '红糖糍粑', '小吃', 255),
          dish('w2-tue-l-11', '小白菜豆腐汤', '汤品', 35),
          dish('w2-tue-l-12', '芽菜肉末炒饭', '主食', 165),
          dish('w2-tue-l-13', '面条', '主食', 135),
          dish('w2-tue-l-14', '白米饭', '主食', 145),
          dish('w2-tue-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w2-tue-d-1', '豆汤饭', '特色套餐', 150),
          dish('w2-tue-d-2', '土豆回锅肉', '荤菜', 260),
          dish('w2-tue-d-3', '榨菜肉丝', '荤菜', 175),
          dish('w2-tue-d-4', '炝炒南瓜', '素菜', 65),
          dish('w2-tue-d-5', '蒜泥菠菜', '素菜', 45),
          dish('w2-tue-d-6', '面2款', '面食', 135),
          dish('w2-tue-d-7', '粉2款', '面食', 130)
        ]
      }
    },
    {
      date: d(2026, 4, 29),
      weekday: '周三',
      weekdayIndex: 2,
      meals: {
        breakfast: [
          dish('w2-wed-b-1', '薏仁粥', '粥品', 62),
          dish('w2-wed-b-2', '大葱肉包', '主食', 242),
          dish('w2-wed-b-3', '麦麸馒头', '主食', 228),
          dish('w2-wed-b-4', '葱花花卷', '主食', 232),
          dish('w2-wed-b-5', '橙香软欧', '西点', 280),
          dish('w2-wed-b-6', '香蕉蛋糕', '西点', 320),
          dish('w2-wed-b-7', '煎鸡蛋', '蛋类', 165),
          dish('w2-wed-b-8', '白水蛋', '蛋类', 145),
          dish('w2-wed-b-9', '香菜鸡蛋干', '养生蔬菜', 80),
          dish('w2-wed-b-10', '炒土耳瓜丝', '养生蔬菜', 45),
          dish('w2-wed-b-11', '炒莲白', '养生蔬菜', 50),
          dish('w2-wed-b-12', '炒菜心', '养生蔬菜', 42),
          dish('w2-wed-b-13', '蒸红薯', '粗粮', 90),
          dish('w2-wed-b-14', '黑豆豆浆', '饮品', 52),
          dish('w2-wed-b-15', '纯牛奶', '饮品', 65),
          dish('w2-wed-b-16', '姜辣鸭', '堂烹面臊', 205),
          dish('w2-wed-b-17', '豌杂', '堂烹面臊', 205),
          dish('w2-wed-b-18', '面2款', '面食', 135),
          dish('w2-wed-b-19', '粉2款', '面食', 130),
          dish('w2-wed-b-20', '抄手', '面食', 155)
        ],
        lunch: [
          dish('w2-wed-l-1', '香辣龙骨', '特色菜', 195),
          dish('w2-wed-l-2', '海带雪豆炖蹄花', '荤菜', 195),
          dish('w2-wed-l-3', '苕皮回锅肉', '荤菜', 270),
          dish('w2-wed-l-4', '杏鲍菇炒肉片', '荤菜', 165),
          dish('w2-wed-l-5', '麻婆豆腐', '荤菜', 145),
          dish('w2-wed-l-6', '泡椒土豆丝', '素菜', 85),
          dish('w2-wed-l-7', '酸辣荞面', '素菜', 105),
          dish('w2-wed-l-8', '白灼凤尾', '素菜', 40),
          dish('w2-wed-l-9', '哈密瓜', '水果', 42),
          dish('w2-wed-l-10', '紫薯饼', '小吃', 245),
          dish('w2-wed-l-11', '绿豆龙骨汤', '汤品', 55),
          dish('w2-wed-l-12', '玉米碎米饭', '主食', 148),
          dish('w2-wed-l-13', '白米饭', '主食', 145),
          dish('w2-wed-l-14', '面条', '主食', 135),
          dish('w2-wed-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w2-wed-d-1', '芋儿烧排骨', '荤菜', 210),
          dish('w2-wed-d-2', '肉沫豌豆', '荤菜', 170),
          dish('w2-wed-d-3', '莲白粉丝', '素菜', 95),
          dish('w2-wed-d-4', '炒小白菜', '素菜', 38),
          dish('w2-wed-d-5', '面2款', '面食', 135),
          dish('w2-wed-d-6', '粉2款', '面食', 130),
          dish('w2-wed-d-7', '抄手', '面食', 155)
        ]
      }
    },
    {
      date: d(2026, 4, 30),
      weekday: '周四',
      weekdayIndex: 3,
      meals: {
        breakfast: [
          dish('w2-thu-b-1', '八宝粥', '粥品', 68),
          dish('w2-thu-b-2', '酱肉包', '主食', 250),
          dish('w2-thu-b-3', '玉米馒头', '主食', 232),
          dish('w2-thu-b-4', '黑芝麻花卷', '主食', 238),
          dish('w2-thu-b-5', '肉松蛋糕卷', '西点', 310),
          dish('w2-thu-b-6', '椰蓉面包', '西点', 295),
          dish('w2-thu-b-7', '红糖醪糟蛋', '蛋类', 140),
          dish('w2-thu-b-8', '白水蛋', '蛋类', 145),
          dish('w2-thu-b-9', '红油三丝', '养生蔬菜', 70),
          dish('w2-thu-b-10', '豆芽粉条', '养生蔬菜', 95),
          dish('w2-thu-b-11', '炒西兰花', '养生蔬菜', 50),
          dish('w2-thu-b-12', '炒凤尾', '养生蔬菜', 40),
          dish('w2-thu-b-13', '蒸玉米', '粗粮', 105),
          dish('w2-thu-b-14', '黑芝麻豆浆', '饮品', 56),
          dish('w2-thu-b-15', '纯牛奶', '饮品', 65),
          dish('w2-thu-b-16', '鸡杂', '堂烹面臊', 180),
          dish('w2-thu-b-17', '素椒牛肉', '堂烹面臊', 195),
          dish('w2-thu-b-18', '面2款', '面食', 135),
          dish('w2-thu-b-19', '粉2款', '面食', 130)
        ],
        lunch: [
          dish('w2-thu-l-1', '粗粮狮子头', '特色菜', 225),
          dish('w2-thu-l-2', '家常三角峰', '荤菜', 155),
          dish('w2-thu-l-3', '酸萝卜烧鸡杂', '荤菜', 175),
          dish('w2-thu-l-4', '宫保肉丁', '荤菜', 195),
          dish('w2-thu-l-5', '豇豆肉丝', '荤菜', 180),
          dish('w2-thu-l-6', '小炒花菜', '素菜', 65),
          dish('w2-thu-l-7', '蒜蓉辣椒蒸茄子', '素菜', 75),
          dish('w2-thu-l-8', '菜心', '素菜', 42),
          dish('w2-thu-l-9', '小番茄', '水果', 38),
          dish('w2-thu-l-10', '肉夹馍', '小吃', 280),
          dish('w2-thu-l-11', '煎蛋汤', '汤品', 40),
          dish('w2-thu-l-12', '扬州炒饭', '主食', 170),
          dish('w2-thu-l-13', '面条', '主食', 135),
          dish('w2-thu-l-14', '白米饭', '主食', 145),
          dish('w2-thu-l-15', '米线', '主食', 125)
        ],
        dinner: [
          dish('w2-thu-d-1', '卤肉饭', '特色套餐', 195),
          dish('w2-thu-d-2', '水煮肉片', '荤菜', 210),
          dish('w2-thu-d-3', '青椒肉丝', '荤菜', 185),
          dish('w2-thu-d-4', '白油冬瓜', '素菜', 35),
          dish('w2-thu-d-5', '炒瓢儿白', '素菜', 38),
          dish('w2-thu-d-6', '面2款', '面食', 135),
          dish('w2-thu-d-7', '粉2款', '面食', 130)
        ]
      }
    }
  ]
};

// Week 3: 2026-05-06 to 2026-05-09
const week3 = {
  label: '5.6-5.9',
  startDate: d(2026, 5, 6),
  endDate: d(2026, 5, 9),
  days: [
    {
      date: d(2026, 5, 6),
      weekday: '周三',
      weekdayIndex: 2,
      meals: {
        breakfast: [
          ...dishList('w3-wed-b-porridge', '粥品', ['红薯粥'], 52),
          ...dishList('w3-wed-b-staple', '主食', ['芽菜肉包', '白面馒头', '肉松花卷'], 235),
          ...dishList('w3-wed-b-pastry', '西点', ['香橙蛋糕', '奶香馒头面包'], 300),
          ...dishList('w3-wed-b-egg', '蛋类', ['卤鸡蛋', '白水蛋'], 150),
          ...dishList('w3-wed-b-veg', '养生蔬菜', ['香菜萝卜丝', '炝炒豆芽', '炒大白菜', '蒜泥汉菜'], 50),
          ...dishList('w3-wed-b-grain', '粗粮', ['蒸玉米'], 105),
          ...dishList('w3-wed-b-drink', '饮品', ['核桃花生豆浆', '果蔬汁', '纯牛奶', '花生奶'], 58),
          ...dishList('w3-wed-b-noodle-topping', '堂烹面臊', ['红烧牛肉', '豌杂'], 205),
          ...dishList('w3-wed-b-noodle', '面食', ['面2款', '粉2款'], 135)
        ],
        lunch: [
          ...dishList('w3-wed-l-special', '特色菜', ['鲜笋酸菜鸡'], 175),
          ...dishList('w3-wed-l-meat', '荤菜', ['豆筋烧排骨', '蒜泥白肉', '香菇肉片', '五彩虾仁蒸蛋'], 185),
          ...dishList('w3-wed-l-veg', '素菜', ['小炒有机花菜', '酸辣凉粉', '炒瓢儿白'], 68),
          ...dishList('w3-wed-l-fruit', '水果', ['枇杷'], 45),
          ...dishList('w3-wed-l-snack', '小吃', ['三大炮'], 260),
          ...dishList('w3-wed-l-soup', '汤品', ['薏米红豆龙骨汤'], 58),
          ...dishList('w3-wed-l-staple', '主食', ['芽菜肉末炒饭', '面条', '白米饭', '米线'], 145)
        ],
        dinner: [
          ...dishList('w3-wed-d-meat', '荤菜', ['青椒回锅肉', '高笋肉片'], 205),
          ...dishList('w3-wed-d-veg', '素菜', ['醋溜大白菜', '蒜泥菠菜'], 50),
          ...dishList('w3-wed-d-noodle', '面食', ['面2款', '粉2款'], 135)
        ]
      }
    },
    {
      date: d(2026, 5, 7),
      weekday: '周四',
      weekdayIndex: 3,
      meals: {
        breakfast: [
          ...dishList('w3-thu-b-porridge', '粥品', ['薏仁粥'], 62),
          ...dishList('w3-thu-b-staple', '主食', ['鲜肉包', '麦麸馒头', '葱花花卷'], 235),
          ...dishList('w3-thu-b-pastry', '西点', ['橙香软欧', '香蕉蛋糕'], 300),
          ...dishList('w3-thu-b-egg', '蛋类', ['煎鸡蛋', '白水蛋'], 150),
          ...dishList('w3-thu-b-veg', '养生蔬菜', ['红油豆干', '炒土耳瓜丝', '炒莲白', '炒菜心'], 55),
          ...dishList('w3-thu-b-grain', '粗粮', ['蒸红薯'], 90),
          ...dishList('w3-thu-b-drink', '饮品', ['黑豆豆浆', '果蔬汁', '纯牛奶', '花生奶'], 55),
          ...dishList('w3-thu-b-noodle-topping', '堂烹面臊', ['酸菜肉丝', '豌杂'], 195),
          ...dishList('w3-thu-b-noodle', '面食', ['面2款', '粉2款', '抄手'], 140)
        ],
        lunch: [
          ...dishList('w3-thu-l-special', '特色菜', ['麻辣水煮鱼'], 165),
          ...dishList('w3-thu-l-meat', '荤菜', ['小炒猪头肉', '土豆回锅肉', '双椒棒菜肉丝', '家常豆腐'], 190),
          ...dishList('w3-thu-l-veg', '素菜', ['炝炒土豆丝', '炝拌瓜条', '白灼凤尾'], 65),
          ...dishList('w3-thu-l-fruit', '水果', ['枇杷'], 45),
          ...dishList('w3-thu-l-snack', '小吃', ['南瓜流心球'], 260),
          ...dishList('w3-thu-l-soup', '汤品', ['桃胶红枣银耳汤'], 45),
          ...dishList('w3-thu-l-staple', '主食', ['玉米碎米饭', '白米饭', '面条', '米线', '抄手'], 145)
        ],
        dinner: [
          ...dishList('w3-thu-d-set', '特色套餐', ['大邑肥肠血旺'], 210),
          ...dishList('w3-thu-d-meat', '荤菜', ['啤酒鸭', '酱肉丝'], 205),
          ...dishList('w3-thu-d-veg', '素菜', ['莲白粉丝', '炒小白菜'], 65),
          ...dishList('w3-thu-d-noodle', '面食', ['面2款', '粉2款', '抄手'], 140)
        ]
      }
    },
    {
      date: d(2026, 5, 8),
      weekday: '周五',
      weekdayIndex: 4,
      meals: {
        breakfast: [
          ...dishList('w3-fri-b-porridge', '粥品', ['八宝粥'], 68),
          ...dishList('w3-fri-b-staple', '主食', ['大葱肉包', '玉米馒头', '黑芝麻花卷'], 235),
          ...dishList('w3-fri-b-pastry', '西点', ['肉松蛋糕卷', '椰蓉面包'], 305),
          ...dishList('w3-fri-b-egg', '蛋类', ['红糖醪糟蛋', '白水蛋'], 145),
          ...dishList('w3-fri-b-veg', '养生蔬菜', ['红油三丝', '豆芽粉条', '炒西兰花', '炒瓢儿白'], 60),
          ...dishList('w3-fri-b-grain', '粗粮', ['蒸花生'], 290),
          ...dishList('w3-fri-b-drink', '饮品', ['黑芝麻豆浆', '果蔬汁', '纯牛奶', '花生奶'], 58),
          ...dishList('w3-fri-b-noodle-topping', '堂烹面臊', ['鸡杂', '杂酱'], 190),
          ...dishList('w3-fri-b-noodle', '面食', ['面2款', '粉2款'], 135)
        ],
        lunch: [
          ...dishList('w3-fri-l-special', '特色菜', ['盐焗鸡'], 195),
          ...dishList('w3-fri-l-meat', '荤菜', ['泡椒兔丁', '火爆肝腰', '宫保肉丁', '腰子豆花'], 185),
          ...dishList('w3-fri-l-veg', '素菜', ['豇豆茄子', '白油丝瓜', '香菇菜心'], 62),
          ...dishList('w3-fri-l-fruit', '水果', ['小番茄'], 22),
          ...dishList('w3-fri-l-snack', '小吃', ['蒸饺'], 210),
          ...dishList('w3-fri-l-soup', '汤品', ['绿豆南瓜汤'], 45),
          ...dishList('w3-fri-l-staple', '主食', ['扬州炒饭', '面条', '白米饭', '米线'], 145)
        ],
        dinner: [
          ...dishList('w3-fri-d-meat', '荤菜', ['小煎鸡', '鱼香肉丝'], 195),
          ...dishList('w3-fri-d-veg', '素菜', ['青椒地瓜', '炒软江叶'], 55),
          ...dishList('w3-fri-d-noodle', '面食', ['面2款', '粉2款'], 135)
        ]
      }
    },
    {
      date: d(2026, 5, 9),
      weekday: '周六',
      weekdayIndex: 5,
      meals: {
        breakfast: [
          ...dishList('w3-sat-b-porridge', '粥品', ['红豆粥'], 60),
          ...dishList('w3-sat-b-staple', '主食', ['酱肉包', '白面馒头', '椒盐花卷'], 235),
          ...dishList('w3-sat-b-pastry', '西点', ['丹麦烤肠', '纸杯蛋糕'], 310),
          ...dishList('w3-sat-b-egg', '蛋类', ['煎蛋', '白水蛋'], 150),
          ...dishList('w3-sat-b-veg', '养生蔬菜', ['红油折耳根', '炒土豆片', '糊辣藕丁', '炒下锅耙'], 65),
          ...dishList('w3-sat-b-grain', '粗粮', ['蒸山药'], 55),
          ...dishList('w3-sat-b-drink', '饮品', ['红豆豆浆', '果蔬汁', '纯牛奶', '花生奶'], 58),
          ...dishList('w3-sat-b-noodle-topping', '堂烹面臊', ['红烧肥肠', '杂酱'], 220),
          ...dishList('w3-sat-b-noodle', '面食', ['面2款', '粉2款'], 135)
        ],
        lunch: [
          ...dishList('w3-sat-l-special', '特色菜', ['青笋鱼香肘子'], 210),
          ...dishList('w3-sat-l-meat', '荤菜', ['水煮牛肉', '山药木耳肉片', '泡椒鸡杂', '肉末豌豆'], 185),
          ...dishList('w3-sat-l-veg', '素菜', ['耙耙菜', '酱爆莲白', '炝炒上海青'], 60),
          ...dishList('w3-sat-l-fruit', '水果', ['枇杷'], 45),
          ...dishList('w3-sat-l-snack', '小吃', ['红薯饼'], 230),
          ...dishList('w3-sat-l-soup', '汤品', ['番茄煎蛋汤'], 45),
          ...dishList('w3-sat-l-staple', '主食', ['小米蒸饭', '面条', '白米饭', '米线'], 145)
        ],
        dinner: [
          ...dishList('w3-sat-d-meat', '荤菜', ['小土豆烧月牙骨', '鸡丝凉面'], 205),
          ...dishList('w3-sat-d-veg', '素菜', ['炒南瓜丝', '蚝油生菜'], 55),
          ...dishList('w3-sat-d-noodle', '面食', ['面2款', '粉2款'], 135)
        ]
      }
    }
  ]
};

const weeks = [week1, week2, week3];

function getDefaultGrams(category) {
  switch (category) {
    case '粥品': return 250;
    case '饮品': return 250;
    case '汤品': return 200;
    case '水果': return 100;
    case '小吃': return 80;
    case '蛋类': return 60;
    case '粗粮': return 120;
    case '养生蔬菜': return 100;
    case '素菜': return 120;
    case '西点': return 80;
    case '主食': return 120;
    case '面食': return 150;
    case '堂烹面臊': return 100;
    case '特色套餐': return 200;
    case '特色菜': return 150;
    case '荤菜': return 150;
    default: return 120;
  }
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

module.exports = {
  mealLabels,
  weekdayLabels,
  weeks,
  getDefaultGrams,
  getCategoryType,
  macroProfile,
  CATEGORY_FALLBACKS
};
