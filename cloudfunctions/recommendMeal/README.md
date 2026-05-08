# recommendMeal 云函数配置

该云函数用于 AI 推荐菜品，走 MiniMax 的 Anthropic 兼容接口。

在微信开发者工具或云开发控制台里，为 `recommendMeal` 云函数配置环境变量：

- `ANTHROPIC_BASE_URL`: `https://api.minimaxi.com/anthropic`
- `ANTHROPIC_AUTH_TOKEN`: MiniMax API Key
- `ANTHROPIC_MODEL`: `MiniMax-M2.7-highspeed`
- `API_TIMEOUT_MS`: `30000` 到 `60000`

不要把 API Key 写进源码或提交到 GitHub。

如果环境变量未配置，前端会自动回退到本地规则推荐。

如果云函数返回 `source: "AI"`，说明已走 MiniMax；如果显示“本地推荐”，通常是环境变量未配置、云函数未重新部署、接口请求失败或模型返回 JSON 无法解析。
