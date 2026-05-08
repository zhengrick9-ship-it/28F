const {
  mealLabels,
  weeks: localWeeks,
  getDefaultGrams,
  getCategoryType
} = require('../../utils/menuData');

const mealTabs = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' }
];

const recommendModes = [
  { key: 'balanced', label: '均衡' },
  { key: 'lowCal', label: '低卡' },
  { key: 'highProtein', label: '高蛋白' },
  { key: 'random', label: '随机' }
];

const PREFERRED_CATEGORY_ORDER = [
  '粥品', '主食', '西点', '蛋类', '养生蔬菜', '粗粮', '饮品',
  '堂烹面臊', '面食', '特色菜', '荤菜', '素菜', '水果', '小吃', '汤品', '特色套餐'
];

const LOCAL_MENU_IMAGE_URLS_BY_WEEK = {
  '5.6-5.9': ['/assets/menu-previews/20260508-5.6-5.9.jpg'],
  '4.27-4.30': ['/assets/menu-previews/20260429-112251.jpg'],
  '4.20-4.24': ['/assets/menu-previews/20260429-111354.jpg']
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calcNutrition(dish, grams) {
  const amount = Number(grams) || 0;
  const macros = dish.macrosPer100g || {};
  return {
    calories: Math.round((amount * dish.kcalPer100g) / 100),
    protein: Math.round(((amount * (macros.protein || 0)) / 100) * 10) / 10,
    carbs: Math.round(((amount * (macros.carbs || 0)) / 100) * 10) / 10,
    fat: Math.round(((amount * (macros.fat || 0)) / 100) * 10) / 10
  };
}

function hasUsableNutritionMeta(menuWeeks) {
  let total = 0;
  let withMeta = 0;

  (menuWeeks || []).forEach(week => {
    (week.days || []).forEach(day => {
      Object.keys(day.meals || {}).forEach(mealKey => {
        (day.meals[mealKey] || []).forEach(dish => {
          total += 1;
          if (dish.nutritionMeta && dish.nutritionMeta.source) withMeta += 1;
        });
      });
    });
  });

  return total > 0 && withMeta / total > 0.8;
}

Page({
  data: {
    weekOptions: [],
    menuWeeks: localWeeks,
    menuImageUrlsByWeek: LOCAL_MENU_IMAGE_URLS_BY_WEEK,
    selectedWeekIndex: 0,
    selectedWeekLabel: '',
    dayTabs: [],
    selectedDayIndex: 0,
    mealTabs,
    selectedMeal: 'breakfast',
    recommendModes,
    selectedRecommendMode: 'balanced',
    groupedDishes: [],
    selections: {},
    selectedItems: [],
    totalItems: 0,
    totalGrams: 0,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    recommendation: null,
    notice: '',
    weekRangeText: '',
    cloudStatus: '使用本地菜单'
  },

  onLoad() {
    this.initWeeks(localWeeks, '使用本地菜单');
    this.loadCloudMenu();
  },

  initWeeks(menuWeeks, cloudStatus) {
    const todayStr = formatDateKey(new Date());
    const weekOptions = menuWeeks.map(w => w.label);

    let selectedWeekIndex = menuWeeks.length - 1;
    let selectedDayIndex = 0;
    let notice = '';

    let foundToday = false;
    for (let wi = menuWeeks.length - 1; wi >= 0; wi--) {
      const di = menuWeeks[wi].days.findIndex(d => d.date === todayStr);
      if (di >= 0) {
        selectedWeekIndex = wi;
        selectedDayIndex = di;
        foundToday = true;
        break;
      }
    }

    if (!foundToday) {
      notice = `当前日期 ${todayStr} 暂无菜单，已显示最近可用日期`;
      selectedWeekIndex = menuWeeks.length - 1;
      selectedDayIndex = menuWeeks[selectedWeekIndex].days.length - 1;
    }

    const hour = new Date().getHours();
    let selectedMeal = 'breakfast';
    if (hour >= 10 && hour < 14) selectedMeal = 'lunch';
    else if (hour >= 14) selectedMeal = 'dinner';

    this.setData({
      menuWeeks,
      weekOptions,
      selectedWeekIndex,
      selectedWeekLabel: weekOptions[selectedWeekIndex],
      selectedMeal,
      notice,
      cloudStatus
    });

    this.loadDay(selectedWeekIndex, selectedDayIndex);
  },

  loadCloudMenu() {
    if (!wx.cloud || !wx.cloud.callFunction) return;

    wx.cloud.callFunction({
      name: 'getMenu'
    }).then(res => {
      const result = res && res.result ? res.result : {};
      const remoteWeeks = result.weeks;
      if (Array.isArray(remoteWeeks) && remoteWeeks.length > 0) {
        if (result.nutritionSource || hasUsableNutritionMeta(remoteWeeks)) {
          this.initWeeks(remoteWeeks, '已同步云端菜单');
        } else {
          this.setData({ cloudStatus: '云端菜单营养数据较旧，使用本地菜单' });
        }
      }
      this.loadCloudMenuImages(result);
    }).catch(() => {
      this.setData({ cloudStatus: '云端菜单不可用，使用本地菜单' });
    });
  },

  loadCloudMenuImages(result) {
    const imageUrlsByWeek = result && result.menuImageUrlsByWeek;
    if (imageUrlsByWeek && typeof imageUrlsByWeek === 'object') {
      this.setData({
        menuImageUrlsByWeek: {
          ...this.data.menuImageUrlsByWeek,
          ...imageUrlsByWeek
        }
      });
      return;
    }

    const fileIdsByWeek = result && result.menuImageFileIdsByWeek;
    if (fileIdsByWeek && typeof fileIdsByWeek === 'object' && wx.cloud) {
      this.loadCloudMenuImagesByWeek(fileIdsByWeek);
      return;
    }

    const fileIds = result && result.menuImageFileIds;
    if (!Array.isArray(fileIds) || fileIds.length === 0 || !wx.cloud) return;
    const latestWeek = this.data.weekOptions[this.data.weekOptions.length - 1];
    wx.cloud.getTempFileURL({
      fileList: fileIds
    }).then(res => {
      const urls = (res.fileList || [])
        .filter(item => item.status === 0 && item.tempFileURL)
        .map(item => item.tempFileURL);
      if (urls.length > 0) {
        this.setData({
          menuImageUrlsByWeek: {
            ...this.data.menuImageUrlsByWeek,
            [latestWeek]: urls
          }
        });
      }
    });
  },

  loadCloudMenuImagesByWeek(fileIdsByWeek) {
    const weekLabels = Object.keys(fileIdsByWeek).filter(label => {
      const fileIds = fileIdsByWeek[label];
      return Array.isArray(fileIds) && fileIds.length > 0;
    });
    const allFileIds = weekLabels.reduce((list, label) => list.concat(fileIdsByWeek[label]), []);

    if (!allFileIds.length) return;

    wx.cloud.getTempFileURL({
      fileList: allFileIds
    }).then(res => {
      const tempUrlsByFileId = {};
      (res.fileList || []).forEach(item => {
        if (item.status === 0 && item.fileID && item.tempFileURL) {
          tempUrlsByFileId[item.fileID] = item.tempFileURL;
        }
      });

      const nextMap = { ...this.data.menuImageUrlsByWeek };
      weekLabels.forEach(label => {
        const urls = fileIdsByWeek[label]
          .map(fileId => tempUrlsByFileId[fileId])
          .filter(Boolean);
        if (urls.length > 0) nextMap[label] = urls;
      });

      this.setData({ menuImageUrlsByWeek: nextMap });
    });
  },

  loadDay(weekIndex, dayIndex) {
    const weeks = this.data.menuWeeks;
    const week = weeks[weekIndex];
    const day = week.days[dayIndex];

    const dayTabs = week.days.map(d => ({
      date: d.date,
      weekday: d.weekday,
      weekdayIndex: d.weekdayIndex
    }));

    const weekRangeText = `${week.startDate} 至 ${week.endDate}`;

    this.setData({
      dayTabs,
      selectedDayIndex: dayIndex,
      selectedWeekLabel: week.label,
      weekRangeText,
      recommendation: null
    });

    this.updateMealDisplay();
  },

  updateMealDisplay() {
    const weeks = this.data.menuWeeks;
    const week = weeks[this.data.selectedWeekIndex];
    const day = week.days[this.data.selectedDayIndex];
    const mealKey = this.data.selectedMeal;
    const dishes = day.meals[mealKey];
    const selections = this.data.selections;

    const categoryMap = {};
    dishes.forEach(dish => {
      if (!categoryMap[dish.category]) categoryMap[dish.category] = [];
      const sel = selections[dish.id];
      categoryMap[dish.category].push({
        ...dish,
        selected: sel ? !!sel.selected : false,
        grams: sel && sel.grams != null ? sel.grams : ''
      });
    });

    const seen = Object.keys(categoryMap);
    const ordered = PREFERRED_CATEGORY_ORDER.filter(c => seen.includes(c))
      .concat(seen.filter(c => !PREFERRED_CATEGORY_ORDER.includes(c)));

    const groupedDishes = ordered.map(cat => ({
      category: cat,
      dishes: categoryMap[cat]
    }));

    this.setData({ groupedDishes });
    this.updateSummary();
  },

  updateSummary() {
    const weeks = this.data.menuWeeks;
    const week = weeks[this.data.selectedWeekIndex];
    const day = week.days[this.data.selectedDayIndex];
    const selections = this.data.selections;

    const selectedItems = [];
    let totalGrams = 0;
    let totalCalories = 0;

    ['breakfast', 'lunch', 'dinner'].forEach(mealKey => {
      const dishes = day.meals[mealKey];
      dishes.forEach(dish => {
        const sel = selections[dish.id];
        if (sel && sel.selected) {
          const grams = Number(sel.grams) || 0;
          const nutrition = calcNutrition(dish, grams);
          selectedItems.push({
            id: dish.id,
            name: dish.name,
            mealLabel: mealLabels[mealKey],
            grams,
            ...nutrition
          });
          totalGrams += grams;
          totalCalories += nutrition.calories;
        }
      });
    });

    const totalProtein = selectedItems.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = selectedItems.reduce((sum, item) => sum + item.carbs, 0);
    const totalFat = selectedItems.reduce((sum, item) => sum + item.fat, 0);

    this.setData({
      selectedItems,
      totalItems: selectedItems.length,
      totalGrams,
      totalCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10
    });
  },

  selectWeek(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (index === this.data.selectedWeekIndex) return;
    this.setData({ selectedWeekIndex: index });
    this.loadDay(index, 0);
  },

  onWeekPickerChange(e) {
    const index = Number(e.detail.value);
    if (index === this.data.selectedWeekIndex) return;
    this.setData({ selectedWeekIndex: index, recommendation: null });
    this.loadDay(index, 0);
  },

  selectDay(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (index === this.data.selectedDayIndex) return;
    this.setData({ selectedDayIndex: index, recommendation: null });
    this.updateMealDisplay();
  },

  selectMeal(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.selectedMeal) return;
    this.setData({ selectedMeal: key, recommendation: null });
    this.updateMealDisplay();
  },

  selectRecommendMode(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.selectedRecommendMode) return;
    this.setData({ selectedRecommendMode: key, recommendation: null });
  },

  goToday() {
    const weeks = this.data.menuWeeks;
    const todayStr = formatDateKey(new Date());
    let weekIndex = weeks.length - 1;
    let dayIndex = weeks[weeks.length - 1].days.length - 1;

    for (let wi = weeks.length - 1; wi >= 0; wi--) {
      const di = weeks[wi].days.findIndex(d => d.date === todayStr);
      if (di >= 0) {
        weekIndex = wi;
        dayIndex = di;
        break;
      }
    }

    const hour = new Date().getHours();
    let meal = 'breakfast';
    if (hour >= 10 && hour < 14) meal = 'lunch';
    else if (hour >= 14) meal = 'dinner';

    this.setData({
      selectedWeekIndex: weekIndex,
      selectedMeal: meal,
      notice: '',
      recommendation: null
    });
    this.loadDay(weekIndex, dayIndex);
  },

  previewMenuImages() {
    const week = this.data.menuWeeks[this.data.selectedWeekIndex];
    const label = week ? week.label : this.data.selectedWeekLabel;
    const urls = (this.data.menuImageUrlsByWeek && this.data.menuImageUrlsByWeek[label]) || [];
    if (!urls.length) {
      wx.showToast({
        title: '暂无实拍菜谱',
        icon: 'none'
      });
      return;
    }

    wx.previewImage({
      current: urls[0],
      urls
    });
  },

  toggleDish(e) {
    const { dishId } = e.currentTarget.dataset;
    const selections = { ...this.data.selections };
    const current = selections[dishId] || { selected: false, grams: '' };
    const newSelected = !current.selected;

    selections[dishId] = {
      selected: newSelected,
      grams: newSelected ? (current.grams || '100') : ''
    };

    this.setData({ selections, recommendation: null });
    this.updateMealDisplay();
  },

  updateGrams(e) {
    const { dishId } = e.currentTarget.dataset;
    const value = e.detail.value.replace(/[^\d]/g, '');
    const selections = { ...this.data.selections };
    const current = selections[dishId] || { selected: false, grams: '' };

    selections[dishId] = {
      selected: value ? true : false,
      grams: value
    };

    this.setData({ selections });
    this.updateMealDisplay();
  },

  stepGrams(e) {
    const { dishId, delta } = e.currentTarget.dataset;
    const selections = { ...this.data.selections };
    const current = selections[dishId] || { selected: false, grams: '' };
    let grams = parseInt(current.grams, 10) || 0;
    grams = Math.max(0, grams + parseInt(delta, 10));

    selections[dishId] = {
      selected: grams > 0,
      grams: String(grams)
    };

    this.setData({ selections });
    this.updateMealDisplay();
  },

  recommendMeal() {
    const labels = this.data.recommendModes.map(item => item.label);
    wx.showActionSheet({
      itemList: labels,
      success: res => {
        const mode = this.data.recommendModes[res.tapIndex];
        if (!mode) return;
        this.setData({ selectedRecommendMode: mode.key, recommendation: null });
        this.runRecommendation();
      }
    });
  },

  runRecommendation() {
    const weeks = this.data.menuWeeks;
    const week = weeks[this.data.selectedWeekIndex];
    const day = week.days[this.data.selectedDayIndex];
    const mealKey = this.data.selectedMeal;
    const dishes = day.meals[mealKey];

    if (!dishes || dishes.length === 0) {
      this.setData({ recommendation: { dishes: [], totalCalories: 0 } });
      return;
    }

    wx.showLoading({ title: '推荐中' });
    if (wx.cloud && wx.cloud.callFunction) {
      wx.cloud.callFunction({
        name: 'recommendMeal',
        data: {
          mode: this.data.selectedRecommendMode,
          mealKey,
          mealLabel: mealLabels[mealKey],
          date: day.date,
          weekday: day.weekday,
          dishes
        }
      }).then(res => {
        const result = res && res.result ? res.result : {};
        if (result.ok && Array.isArray(result.dishIds) && result.dishIds.length > 0) {
          this.applyRecommendationByIds(dishes, result.dishIds, result.reason || '按当前菜单生成推荐', result.source || 'ai');
        } else {
          this.recommendMealLocally(dishes, '本地推荐');
        }
      }).catch(() => {
        this.recommendMealLocally(dishes, '本地推荐');
      }).finally(() => {
        wx.hideLoading();
      });
      return;
    }

    this.recommendMealLocally(dishes, '本地推荐');
    wx.hideLoading();
  },

  recommendMealLocally(dishes, source) {
    const mode = this.data.selectedRecommendMode;
    if (mode === 'random') {
      const shuffled = dishes.slice().sort(() => Math.random() - 0.5);
      this.applyRecommendation(shuffled.slice(0, Math.min(4, Math.max(2, shuffled.length))), source || '本地推荐');
      return;
    }

    const byType = { staple: [], protein: [], vegetable: [], other: [] };
    dishes.forEach(dish => {
      const type = getCategoryType(dish.category);
      byType[type].push(dish);
    });

    const pickOne = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
    const picked = [];

    const byCalories = item => item.kcalPer100g;
    const byProtein = item => -((item.macrosPer100g && item.macrosPer100g.protein) || 0);
    const staplePool = mode === 'lowCal' ? byType.staple.slice().sort((a, b) => byCalories(a) - byCalories(b)).slice(0, 2) : byType.staple;
    const proteinPool = mode === 'highProtein' ? byType.protein.slice().sort((a, b) => byProtein(a) - byProtein(b)).slice(0, 3) : byType.protein;
    const vegetablePool = byType.vegetable;
    const staple = mode === 'random' ? null : pickOne(staplePool);
    const protein = pickOne(proteinPool);
    const vegetable = pickOne(vegetablePool);

    if (staple) picked.push(staple);
    if (protein) picked.push(protein);
    if (vegetable) picked.push(vegetable);

    const allRemaining = dishes.filter(d => !picked.includes(d));
    if (allRemaining.length > 0 && (picked.length < 2 || Math.random() > 0.35)) {
      picked.push(pickOne(allRemaining));
    }

    if (mode === 'lowCal') {
      picked.sort((a, b) => a.kcalPer100g - b.kcalPer100g);
      picked.splice(3);
    }

    this.applyRecommendation(picked, source || '本地推荐');
  },

  applyRecommendationByIds(dishes, dishIds, reason, source) {
    const picked = dishIds
      .map(id => dishes.find(dish => dish.id === id))
      .filter(Boolean);
    this.applyRecommendation(picked.length > 0 ? picked : dishes.slice(0, 3), source || 'ai', reason);
  },

  applyRecommendation(picked, source, reason) {
    const recommendationDishes = picked.map(dish => {
      const grams = getDefaultGrams(dish.category);
      return { ...dish, grams, ...calcNutrition(dish, grams) };
    });

    const totalCalories = recommendationDishes.reduce((s, d) => s + d.calories, 0);
    const totalProtein = recommendationDishes.reduce((s, d) => s + d.protein, 0);
    const totalCarbs = recommendationDishes.reduce((s, d) => s + d.carbs, 0);
    const totalFat = recommendationDishes.reduce((s, d) => s + d.fat, 0);

    this.setData({
      recommendation: {
        dishes: recommendationDishes,
        totalCalories,
        totalProtein: Math.round(totalProtein * 10) / 10,
        totalCarbs: Math.round(totalCarbs * 10) / 10,
        totalFat: Math.round(totalFat * 10) / 10,
        source,
        reason: reason || '按餐次、主食、蛋白和蔬菜做搭配'
      }
    });
  },

  clearSelections() {
    const weeks = this.data.menuWeeks;
    const week = weeks[this.data.selectedWeekIndex];
    const day = week.days[this.data.selectedDayIndex];
    const selections = { ...this.data.selections };

    ['breakfast', 'lunch', 'dinner'].forEach(mealKey => {
      day.meals[mealKey].forEach(dish => {
        delete selections[dish.id];
      });
    });

    this.setData({ selections, recommendation: null });
    this.updateMealDisplay();
  }
});
