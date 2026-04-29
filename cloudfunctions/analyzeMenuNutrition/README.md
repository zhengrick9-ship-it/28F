# analyzeMenuNutrition 云函数配置

该函数用于每周更新菜单后批量生成菜品营养数据，返回每 100g 的热量、蛋白质、碳水、脂肪，以及来源和置信度。

## 推荐流程

1. 上传本周菜单图片到 `menu-images/`。
2. OCR 或手动整理菜名，生成 `weeks` 或 `dishes` JSON。
3. 调用 `analyzeMenuNutrition`。
4. 人工抽查低置信度菜品，再写回 `getMenu` 的云端菜单数据。

## 环境变量

如需 AI 校准，和 `recommendMeal` 使用同一套 MiniMax Anthropic 兼容配置：

- `ANTHROPIC_BASE_URL`: `https://api.minimaxi.com/anthropic`
- `ANTHROPIC_AUTH_TOKEN`: MiniMax API Key
- `ANTHROPIC_MODEL`: `MiniMax-M2.7-highspeed`
- `API_TIMEOUT_MS`: `30000`

不要把 API Key 写进源码或提交到 GitHub。未配置 Key 时，函数会只返回本地菜名估算结果。

## 数据源策略

当前实现不是医学级营养数据库，属于“菜名/食材/烹饪方式估算 + AI 校准”。后续若要进一步提高可靠性，建议接入中文商业食物库，例如唤醒食物、天聚数行食物营养接口；国际兜底可接 USDA FoodData Central。AI 只负责拆解菜品和选择接近条目，不直接作为唯一数据源。
