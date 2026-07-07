<div align="center">

<img src="assets/slide-cover.png" alt="agent-deck — cover slide of the reference template" width="720">

# agent-deck

**One HTML file that presents, edits itself live, and exports a pixel-perfect PDF.**<br>
Slides for the AI-agent era — the deck *is* the source, the player, and the editor.

English&nbsp;·&nbsp;[简体中文](README.zh-CN.md)&nbsp;·&nbsp;[한국어](README.ko.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Dependencies: zero](https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square)
![Single file](https://img.shields.io/badge/single%20file-offline--ready-orange?style=flat-square)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-8A2BE2?style=flat-square)

**[▶ Live Demo](https://dengyufan0.github.io/agent-deck/template.html)** — open it and press <kbd>?</kbd>

</div>

---

## Why replace PowerPoint?

| | PowerPoint (.pptx) | agent-deck (.html) |
|---|---|---|
| **AI agents** | Binary black box; needs toolchains | Plain text — any agent reads & rewrites the whole file in one turn |
| **Editing during the talk** | Exit slideshow → edit → restart | Press <kbd>E</kbd>, edit right on the slide |
| **Version history** | Filename discipline, if you're lucky | Revision log embedded *inside* the file, auto-versioned filenames |
| **Distribution** | Needs Office; fonts break | Any browser, fully offline; PDF snapshot is 100% faithful |

## Features

- **Present** — 16:9 (1280×720), keyboard navigation, fullscreen, deep links (`#5`), toolbar **and cursor auto-hide** while presenting: the audience sees nothing but slides.
- **Edit live** — press <kbd>E</kbd>: every slide becomes editable in place. Paste is forced to plain text; edits autosave to `localStorage`; reopening offers a restore banner; over-tall content gets a red warning before the PDF silently crops it.
- **Versioned by design** — *Save new version* downloads `title_v02_date.html` with your change note appended to the embedded revision log. <kbd>Ctrl</kbd>+<kbd>S</kbd> is intercepted (the browser's native "save page" would silently lose your edits).
- **One-click PDF** — `window.print()` with `@page` sized exactly like a PowerPoint 16:9 page. One slide per page, UI hidden, backgrounds preserved, no trailing blank page. Zero libraries.
- **Agent-native** — a written contract ([PROMPT.md](PROMPT.md)) lets **any** AI agent (Claude, ChatGPT, Gemini, DeepSeek…) generate or modify compliant decks. The contract is the interface.

## Quick start

1. Grab [template.html](template.html) and open it in Chrome/Edge — that's already a usable deck;
2. <kbd>→</kbd> to navigate, <kbd>F</kbd> for fullscreen, move the mouse to summon the toolbar;
3. <kbd>E</kbd> to edit, then *Save new version* → you get `deck_v02_date.html` with the revision log inside;
4. *Export PDF* → print dialog → *Save as PDF* → a page-perfect 16:9 PDF.

## Generate decks with any AI agent

[PROMPT.md](PROMPT.md) ships three ready-to-paste prompts (an English translation lives in [PROMPT.en.md](PROMPT.en.md); **the Chinese contract is canonical**):

- **A — from scratch**: paste the contract + your outline into any chat agent;
- **B — incremental edits** (daily driver): send your current `vN.html` + the B prompt;
- **C — migrate from PPT**: paste your old deck's text content.

Then run the **60-second acceptance checklist** at the bottom of PROMPT.md. Any failed item goes straight back to the agent, verbatim.

## What a slide looks like

<div align="center"><img src="assets/slide-results.png" alt="results slide with an inline SVG chart" width="720"></div>

Charts are inline SVG — editable in place, tiny file size, no bitmap screenshots.

## Install as a Claude Code skill

Copy [`skill/`](skill/) to `~/.claude/skills/agent-deck/` and say `/agent-deck`. The skill generates decks from the template, then self-verifies them (script integrity, navigation, autosave, serialization, zero external references) before handing you the file.

## Repository layout

| File | Role |
|------|------|
| [template.html](template.html) | Reference implementation — also a ready-to-use deck and the "gold answer" you can show any agent |
| [PROMPT.md](PROMPT.md) | The contract, three usage prompts, acceptance checklist (**canonical, Chinese**) |
| [PROMPT.en.md](PROMPT.en.md) | English translation of the contract |
| [METHODOLOGY.md](METHODOLOGY.md) | Full methodology: design rationale, workflow, known pitfalls (Chinese) |
| [DESIGN.md](DESIGN.md) | Visual identity spec (Chinese) |
| [skill/SKILL.md](skill/SKILL.md) | Claude Code skill |

## Three rules of discipline

1. **The file is the truth** — browser autosave is only a safety net; always *Save new version* after the meeting;
2. **Zero dependencies is a red line** — no CDN, no web fonts, no bitmap screenshots, ever;
3. **Export PDF from Chrome/Edge** — check *Background graphics*, uncheck *Headers and footers*.

## License

[MIT](LICENSE) — take it to your lab meeting, your team review, or anywhere PowerPoint is still causing pain.
