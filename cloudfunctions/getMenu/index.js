const cloud = require('wx-server-sdk');
const { weeks: localWeeks } = require('./menuData');
const { estimateDishNutrition } = require('./nutrition');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

function localMenuResult(reason) {
  return {
    weeks: localWeeks,
    source: reason || 'local',
    nutritionSource: 'dish-name-and-ingredient-estimator',
    menuImageUrlsByWeek: {},
    menuImageFileIdsByWeek: {
      '5.6-5.9': [],
      '4.27-4.30': [],
      '4.20-4.24': []
    },
    menuImageFileIds: [],
    updatedAt: new Date().toISOString()
  };
}

function normalizeWeek(record, weekIndex) {
  const week = record.week && typeof record.week === 'object'
    ? record.week
    : {
      label: record.label,
      startDate: record.startDate,
      endDate: record.endDate,
      days: record.days
    };

  if (!week || !week.label || !Array.isArray(week.days)) return null;

  return enrichWeek({
    label: week.label,
    startDate: week.startDate || record.startDate,
    endDate: week.endDate || record.endDate,
    days: week.days
  }, weekIndex);
}

function normalizeDish(dish, fallback) {
  const raw = typeof dish === 'string' ? { name: dish } : (dish || {});
  const name = raw.name || '未命名菜品';
  const category = raw.category || fallback.category || '其他';
  const id = raw.id || [
    fallback.weekIndex,
    fallback.dayIndex,
    fallback.mealKey,
    fallback.categoryIndex,
    fallback.dishIndex,
    name
  ].join('-').replace(/\s+/g, '-');

  if (raw.kcalPer100g && raw.macrosPer100g) {
    return {
      ...raw,
      id,
      name,
      category
    };
  }

  return {
    ...raw,
    id,
    name,
    category,
    ...estimateDishNutrition(name, category, raw.kcalPer100g)
  };
}

function normalizeMealDishes(items, fallback) {
  if (!Array.isArray(items)) return [];

  return items.map((item, dishIndex) => normalizeDish(item, { ...fallback, dishIndex }));
}

function normalizeMealValue(value, fallback) {
  if (Array.isArray(value)) {
    return normalizeMealDishes(value, fallback);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((list, category, categoryIndex) => {
      const items = Array.isArray(value[category]) ? value[category] : [];
      return list.concat(normalizeMealDishes(items, {
        ...fallback,
        category,
        categoryIndex
      }));
    }, []);
  }

  return [];
}

function getWeekdayIndex(day) {
  if (day.weekdayIndex != null) return day.weekdayIndex;
  const weekdayMap = {
    '周一': 0,
    '星期一': 0,
    '周二': 1,
    '星期二': 1,
    '周三': 2,
    '星期三': 2,
    '周四': 3,
    '星期四': 3,
    '周五': 4,
    '星期五': 4,
    '周六': 5,
    '星期六': 5,
    '周日': 6,
    '星期日': 6,
    '周天': 6,
    '星期天': 6
  };
  if (weekdayMap[day.weekday] != null) return weekdayMap[day.weekday];

  const date = new Date(day.date);
  if (!Number.isNaN(date.getTime())) {
    const jsDay = date.getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  return 0;
}

function enrichWeek(week, weekIndex) {
  const days = (week.days || []).map((day, dayIndex) => {
    const meals = {};
    ['breakfast', 'lunch', 'dinner'].forEach(mealKey => {
      meals[mealKey] = normalizeMealValue(day.meals && day.meals[mealKey], {
        weekIndex: weekIndex || week.label,
        dayIndex,
        mealKey,
        categoryIndex: 0
      });
    });

    return {
      date: day.date,
      weekday: day.weekday,
      weekdayIndex: getWeekdayIndex(day),
      meals
    };
  });

  return {
    ...week,
    days
  };
}

function collectImageFileIdsByWeek(records) {
  return records.reduce((map, record) => {
    const week = normalizeWeek(record);
    if (!week) return map;

    const fileIds = record.menuImageFileIds || record.imageFileIds || record.imageFileIDList || [];
    if (Array.isArray(fileIds) && fileIds.length > 0) {
      map[week.label] = fileIds;
    }
    return map;
  }, {});
}

function collectImageUrlsByWeek(records) {
  return records.reduce((map, record) => {
    const week = normalizeWeek(record);
    if (!week) return map;

    const urls = record.menuImageUrls || record.imageUrls || [];
    if (Array.isArray(urls) && urls.length > 0) {
      map[week.label] = urls;
    }
    return map;
  }, {});
}

exports.main = async () => {
  try {
    const res = await db.collection('menus')
      .where({
        status: _.in(['active', 'published'])
      })
      .orderBy('startDate', 'asc')
      .limit(20)
      .get();

    const records = res.data || [];
    const weeks = records.map(normalizeWeek).filter(Boolean);

    if (!weeks.length) {
      return localMenuResult('local-empty-cloud-db');
    }

    return {
      weeks,
      source: 'cloud-db',
      nutritionSource: 'cloud-db-or-dish-name-estimator',
      menuImageUrlsByWeek: collectImageUrlsByWeek(records),
      menuImageFileIdsByWeek: collectImageFileIdsByWeek(records),
      menuImageFileIds: [],
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      ...localMenuResult('local-cloud-db-error'),
      cloudError: String(error.message || error).slice(0, 240)
    };
  }
};
