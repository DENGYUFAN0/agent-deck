# Changelog

## v0.1.0 — 2026-07-07

首个公开版本 / First public release。从方法论到基础设施的完整闭环。

### 核心能力
- 单文件零依赖 HTML 幻灯片模板（template.html）：16:9 放映、键盘导航、`#N` 深链、全屏；
- 现场编辑（E 键，contenteditable）+ localStorage 自动暂存 + 重开恢复横幅；
- 「保存新版本」自序列化落盘：版本号自增、修改说明与时间内嵌文件（revision-log）；
- 一键导出 PDF：window.print + @page 1280×720px（恰好等于 PPT 16:9 页面），一片一页、无空白页；
- 跨 agent 契约：PROMPT.md（中文正典）/ PROMPT.en.md（英文版），三种用法（从零生成 / 增量修改 / PPT 迁移）+ 60 秒验收清单。

### 鲁棒性
- 拦截 Ctrl+S 转「保存新版本」（浏览器原生另存会无声丢修改）；
- beforeprint 兜底：直接 Ctrl+P 也自动退出编辑、收起浮层；
- 编辑内容超高实时红框警告（超出部分放映与 PDF 均被裁掉）；
- 粘贴转纯文本走 Selection/Range 标准 API（已废弃的 execCommand 仅作后备）；
- 放映隐蔽：工具栏与鼠标光标静止 2.5s 自动隐藏、鼠标唤出、编辑常显。

### 基础设施
- 合规校验器 checker/（27 项自动验收：断网加载、翻页、编辑、暂存、序列化、打印样式、PDF 页数与 16:9 尺寸机检）；
- GitHub Actions CI：每次 push 对模板跑全套校验；
- 契约第 7 条「机器验收锚点」：任何守约 deck 皆可机检；
- 三语 README（English / 简体中文 / 한국어，中文为正典）+ Claude Code skill（skill/）。

### 已知限制
见 README「Known limits / 已知限制」：PDF 为同机保真、编辑是文字级非版式级、单人单文件（无实时协作）。
