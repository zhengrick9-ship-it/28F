# 每周菜单更新流程

目标：小程序代码审核通过后，每周只更新云端数据，不重新提交审核。Rick 每周只需要把菜单图发给 Codex，Codex 负责整理菜单 JSON；Rick 在 CloudBase 控制台运行一次 `publishMenu` 云函数完成发布。

## 一次性准备

1. 在 CloudBase 数据库中新建集合：

```text
menus
```

2. 部署云函数：

```text
cloudfunctions/getMenu
cloudfunctions/recommendMeal
cloudfunctions/publishMenu
```

`getMenu` 会优先读取数据库 `menus`；如果数据库为空或异常，会回退代码内置菜单。

3. 给 `publishMenu` 配置环境变量：

```text
MENU_ADMIN_TOKEN = 自己设置一串发布口令
```

这个口令只用于发布菜单，不要放进小程序代码。

## 每周更新

### 1. 上传实拍菜单图

在 CloudBase 控制台：

```text
云存储 -> 上传文件
```

建议路径：

```text
menu-images/2026-05-11_2026-05-16.jpg
```

上传后复制文件 ID，格式类似：

```text
cloud://cloud1-xxxx.menu-images/2026-05-11_2026-05-16.jpg
```

### 2. 把菜单图发给 Codex

MiniMax-M2.7-highspeed 不负责识图。图片只做“实拍菜谱”预览。

菜单文字可以用这些方式得到：

- 微信/系统相册的“提取文字”
- 腾讯云 OCR
- 人工整理
- 把 OCR 出来的文字发给 Codex，让 Codex 转成菜单 JSON

实际推荐流程：

```text
Rick 发菜单图 -> Codex 识别/整理 -> Codex 生成 publishMenu 调用 JSON
```

### 3. 发布菜单

进入：

```text
云函数 -> publishMenu -> 云端测试
```

粘贴 Codex 给你的 JSON，结构如下：

```json
{
  "adminToken": "你的 MENU_ADMIN_TOKEN",
  "archiveExisting": true,
  "menu": {
    "label": "5.11-5.16",
    "startDate": "2026-05-11",
    "endDate": "2026-05-16",
    "status": "active",
    "imageFileIds": ["cloud://cloud1-xxxx.menu-images/2026-05-11_2026-05-16.jpg"],
    "days": [
      {
        "date": "2026-05-11",
        "weekday": "周一",
        "weekdayIndex": 0,
        "meals": {
          "breakfast": {
            "粥品": ["南瓜粥"],
            "主食": ["鲜肉包", "白面馒头"],
            "蛋类": ["白水蛋"]
          },
          "lunch": {
            "特色菜": ["盐焗鸡"],
            "荤菜": ["鱼香肉丝"],
            "素菜": ["炒小白菜"],
            "主食": ["白米饭", "面条"]
          },
          "dinner": {
            "荤菜": ["青椒肉丝"],
            "素菜": ["蒜泥菠菜"],
            "面食": ["面2款", "粉2款"]
          }
        }
      }
    ]
  }
}
```

运行成功返回：

```json
{
  "ok": true,
  "action": "created",
  "label": "5.11-5.16",
  "status": "active"
}
```

`getMenu` 会自动给每个菜补：

- `id`
- `kcalPer100g`
- `macrosPer100g`
- `nutritionMeta`

如果你已经有更准确的营养数据，也可以直接在菜品对象里写完整字段。

### 4. 发布/下线规则

`publishMenu` 默认会把旧的 `active` 菜单改成 `published`，并把新菜单设为 `active`。

展示菜单状态：

```json
"status": "active"
```

保留旧菜单但继续可选：

```json
"status": "published"
```

隐藏菜单：

```json
"status": "archived"
```

建议：当前周用 `active`，最近几周可用 `published`，太旧的改成 `archived`。

## 是否需要重新审核

不需要。

以后只运行 `publishMenu` 更新 `menus` 数据库记录和云存储图片，不改小程序代码，不需要重新上传代码包，也不需要微信重新审核。
