const { weeks } = require('./menuData');

exports.main = async () => ({
  weeks,
  nutritionSource: 'dish-name-and-ingredient-estimator',
  menuImageUrlsByWeek: {},
  menuImageFileIdsByWeek: {
    '4.27-4.30': [],
    '4.20-4.24': []
  },
  menuImageFileIds: [],
  updatedAt: new Date().toISOString()
});
