const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const MENUS_COLLECTION = 'menus';

function isMissingCollectionError(error) {
  const text = `${error && error.errCode || ''} ${error && error.message || ''} ${error && error.errMsg || ''}`;
  return text.includes('-502005') || text.includes('DATABASE_COLLECTION_NOT_EXIST') || text.includes('collection not exists');
}

async function ensureMenusCollection() {
  try {
    await db.collection(MENUS_COLLECTION).limit(1).get();
  } catch (error) {
    if (!isMissingCollectionError(error)) {
      throw error;
    }

    try {
      await db.createCollection(MENUS_COLLECTION);
    } catch (createError) {
      const text = `${createError && createError.errCode || ''} ${createError && createError.message || ''} ${createError && createError.errMsg || ''}`;
      if (!text.includes('already') && !text.includes('exist')) {
        throw createError;
      }
    }
  }
}

function validateMenu(menu) {
  if (!menu || typeof menu !== 'object') return 'missing_menu';
  if (!menu.label) return 'missing_label';
  if (!menu.startDate) return 'missing_start_date';
  if (!menu.endDate) return 'missing_end_date';
  if (!Array.isArray(menu.days) || menu.days.length === 0) return 'missing_days';

  for (const day of menu.days) {
    if (!day.date || !day.weekday || !day.meals) return 'invalid_day';
    for (const mealKey of ['breakfast', 'lunch', 'dinner']) {
      if (day.meals[mealKey] == null) return `missing_${mealKey}`;
    }
  }

  return '';
}

function normalizeMenu(menu) {
  return {
    label: menu.label,
    startDate: menu.startDate,
    endDate: menu.endDate,
    status: menu.status || 'active',
    imageFileIds: Array.isArray(menu.imageFileIds) ? menu.imageFileIds : [],
    imageUrls: Array.isArray(menu.imageUrls) ? menu.imageUrls : [],
    days: menu.days,
    source: menu.source || 'weekly-admin-json',
    updatedAt: db.serverDate()
  };
}

exports.main = async event => {
  const adminToken = process.env.MENU_ADMIN_TOKEN;
  if (!adminToken) {
    return { ok: false, error: 'missing_menu_admin_token' };
  }

  if (!event || event.adminToken !== adminToken) {
    return { ok: false, error: 'invalid_admin_token' };
  }

  const menu = event.menu || event;
  const validationError = validateMenu(menu);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  await ensureMenusCollection();

  if (event.archiveExisting !== false) {
    await db.collection(MENUS_COLLECTION)
      .where({ status: 'active' })
      .update({
        data: {
          status: 'published',
          updatedAt: db.serverDate()
        }
      });
  }

  const data = normalizeMenu(menu);
  const existing = await db.collection(MENUS_COLLECTION)
    .where({
      label: data.label,
      startDate: data.startDate
    })
    .limit(1)
    .get();

  if (existing.data && existing.data.length > 0) {
    const id = existing.data[0]._id;
    await db.collection(MENUS_COLLECTION).doc(id).update({ data });
    return {
      ok: true,
      action: 'updated',
      id,
      label: data.label,
      status: data.status
    };
  }

  const res = await db.collection(MENUS_COLLECTION).add({ data });
  return {
    ok: true,
    action: 'created',
    id: res._id,
    label: data.label,
    status: data.status
  };
};
