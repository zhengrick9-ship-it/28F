# recommendMeal 云函数配置

该云函数用于 AI 推荐菜品，走 MiniMax 的 Anthropic 兼容接口。

在微信开发者工具或云开发控制台里，为 `recommendMeal` 云函数配置环境变量：

- `ANTHROPIC_BASE_URL`: `https://api.minimaxi.com/anthropic`
- `ANTHROPIC_AUTH_TOKEN`: MiniMax API Key
- `ANTHROPIC_MODEL`: `MiniMax-M2.7-highspeed`
- `API_TIMEOUT_MS`: `30000`

不要把 API Key 写进源码或提交到 GitHub。

如果环境变量未配置，前端会自动回退到本地规则推荐。
