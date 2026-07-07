# agent-deck

**在线 Demo：<https://dengyufan0.github.io/agent-deck/template.html>**（按 `?` 看帮助；导出 PDF 请用 Chrome/Edge）

**用 HTML 取代 PPT 做汇报**：让任何一家 AI agent 按同一份契约，生成「单文件、可放映、**可现场编辑**、**可一键导出 PDF**」的幻灯片。HTML 是唯一源文件，PDF 是定稿快照。

*English: **agent-deck** is a methodology + contract that lets **any AI agent** generate self-contained HTML slide decks that replace PowerPoint: present in any browser (offline, zero dependencies), **edit live during the meeting** (press `E`), save a new versioned file with an embedded revision log, and **export a pixel-perfect 16:9 PDF** via the browser print engine. The contract lives in [PROMPT.md](PROMPT.md) (Chinese; any modern agent follows it fine), the reference implementation in [template.html](template.html). Open `template.html` in Chrome/Edge and press `?` to see everything.*

## 为什么这能改变 PPT 汇报的格局

1. **源文件 = 播放器 = 编辑器**：一个 HTML 文件双击即放映，会中按 `E` 当场改，不用退出放映切软件；
2. **AI agent 原生格式**：纯文本，任何 agent 整文件读写，一轮对话完成生成或修改——.pptx 对 agent 是黑盒，HTML 是母语；
3. **文件自带历史**：每次「保存新版本」自动版本号 +1、修改说明内嵌文件中，版本文件串起来就是一条进展时间线；PDF 快照负责分发归档，百分百保真。

## 一分钟上手

1. 双击 [template.html](template.html)（用 Chrome/Edge 打开）——这就是一份能直接用的汇报模板；
2. 按 `→` 翻页，`F` 全屏，`?` 看帮助；
3. 按 `E` 进入编辑模式，点击文字直接改；
4. 底部工具栏点「保存新版本」→ 下载出 `xxx_v02_日期.html`（内嵌修改记录）；
5. 点「导出 PDF」→ 打印对话框选「另存为 PDF」→ 得到逐页 16:9 的 PDF。

## 以后怎么用任何 AI agent 生成新汇报

打开 [PROMPT.md](PROMPT.md)，三种用法：

- **A 段**：从零生成（粘提示词 + 你的大纲，任何聊天型 agent 都行；组会/答辩/评审/课程展示任意场景）；
- **B 段**：增量修改现有版本（日常最常用）；
- **C 段**：从旧 PPT 迁移。

生成后按 PROMPT.md 文末的 **60 秒验收清单**自测，不合格的条目原文丢回给 agent 让它修。

## 文件清单

| 文件 | 作用 |
|------|------|
| [template.html](template.html) | 参考实现 + 可直接用的汇报模板（也是给 agent 看的"标准答案"） |
| [PROMPT.md](PROMPT.md) | 万能提示词（跨 agent 的核心资产）+ 验收清单 |
| [METHODOLOGY.md](METHODOLOGY.md) | 方法论全文：技术定案的理由、工作流、已知坑、扩展模块 |
| [DESIGN.md](DESIGN.md) | 视觉规范（动 UI 前先读） |
| [skill/SKILL.md](skill/SKILL.md) | Claude Code 本机 skill（复制到 `~/.claude/skills/agent-deck/` 即装） |

## 纪律（只记三条）

1. **文件才是真身**：浏览器里的自动暂存只是安全网，会后立刻「保存新版本」落盘；
2. **零依赖是红线**：任何版本都不得引入 CDN / 外部字体 / 位图截图；
3. **导 PDF 认准 Chrome/Edge**，勾「背景图形」、关「页眉和页脚」。

## Roadmap

- 英文版提示词契约（PROMPT.en.md）
- 可选扩展模块的参考实现（演讲者备注 / 总览模式 / 计时器，见 METHODOLOGY §8）

## License

MIT — 随意使用、修改、传播；欢迎把它带进你的组会 / 团队周会 / 任何还在被 PPT 折磨的地方。
