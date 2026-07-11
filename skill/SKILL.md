---
name: agent-deck
description: |
  agent-deck·单文件 HTML 幻灯片生成器（HTML 取代 PPT：可放映、可现场编辑、可一键导 PDF、版本记录内嵌文件中）。用于生成新汇报或增量修改现有 agent-deck 文件。
  触发：用户输入 /agent-deck；或明确要求做「HTML 幻灯片 / 网页幻灯片 / agent-deck 格式的汇报」。
  不触发：用户要 .pptx / PPT 文件时；泛泛聊 HTML、演示技巧、汇报内容本身而没要幻灯片时。
---

# agent-deck 幻灯片生成

> 安装：把本目录复制为 `~/.claude/skills/agent-deck/`（Windows: `C:\Users\<你>\.claude\skills\agent-deck\`）。
> 建议把整个 agent-deck 仓库 clone 到本地，并把下面的路径改成你的仓库路径；也可以直接引用 GitHub 原始文件。

## 资产（动手前先读）

- **契约**：仓库根目录 `PROMPT.md` —— 默认走 A 段「母版填充」（两条铁律 + 组件说明书）；完整契约见 A+ 段（硬性要求 1–7 + 可选 8/9），契约即接口，任何一条不满足都算失败；
- **基底**：仓库根目录 `template.html` —— 学术浅色母版（正典）；路演/发布/提案场景改用 `masters/corporate.html`（企业暗色，场景路由见 PROMPT.md 文首；其 THEME-TOKENS 换色须经用户确认）；
- **视觉**：仓库根目录 `DESIGN.md` —— 学术浅色，动 UI 前必读；
- 仓库地址：https://github.com/DENGYUFAN0/agent-deck 。

## 流程

1. **收集内容**：向用户要大纲/素材；没给全的按场景惯例补【】占位符，不要空着也不要编造。
2. **生成方式**：
   - 新汇报 → 母版填充：只改 ✂ CONTENT-START/END 界标之内 + title + meta deck-id，机件（样式/脚本/工具栏/浮层）一个字符不动；
   - 用户点名要创造感 → 走 PROMPT.md 的 A-max 创作模式（自由构版 + custom-style 区仅 .x- 前缀类 + 令牌换肤须确认），建议先出策划稿（A-pro）；
   - 改现有 deck → 按 PROMPT.md B 段规则增量修改，不破坏 meta / revision-log 结构。
3. **元数据**：deck-id = 主题英文或拼音 + 日期（如 `topic-20260707`）；新文件 deck-version 从 1 起；文件名 `主题_v01_日期.html`。
4. **默认值**（用户没说就用这些）：汇报人【姓名】占位；16:9 学术浅色；语言跟随用户。
5. **产出后必须自动验证**（起本地服务器或预览面板，逐项 eval 检查）：
   - `window.deck` API 齐全（脚本没被截断的铁证）；
   - 翻页后页码变化；
   - 编辑模式下修改 → localStorage 出现 `agent-deck:` 前缀的 key 且含改动；
   - `window.deck.serialize()` 以 `<!DOCTYPE html>` 开头、含 revision-log；
   - 全文无 `http(s)://` 外部资源引用（零依赖红线）。
6. **交付**：给出文件路径 + 提醒用户跑 PROMPT.md 文末 60 秒验收清单里机器测不了的两条：断网双击打开、导出 PDF 核对页数与 16:9。

## 红线

- 零依赖：禁 CDN、外部字体、位图截图（图表一律内联 SVG）；
- 内联脚本任何位置（包括 JS 注释和字符串）不得出现 script 结束标签的字面量——HTML 解析器会当场截断脚本；
- 不为「简化实现」砍掉契约里的任何能力。
