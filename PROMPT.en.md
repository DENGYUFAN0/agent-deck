# PROMPT.en.md — Universal Prompt (paste into any AI agent)

> **Translation notice:** this is an English translation of [PROMPT.md](PROMPT.md). If the two ever disagree, **the Chinese version is canonical.**
>
> Usage: copy the block below into any AI agent (Claude / ChatGPT / Gemini / DeepSeek / Kimi…), replacing the 【】 placeholders with your content.
> If the agent accepts file uploads, also attach `template.html` and add "follow this file's implementation" — highest fidelity.
> After generation, run the 60-second acceptance checklist at the bottom; paste any failed item back to the agent verbatim.

---

## A. Generate a new deck from scratch (main prompt)

```text
Generate a single-file HTML slide deck for me (scenario: 【lab meeting / thesis defense / project review / course presentation / any】), strictly satisfying the following contract. The contract is the interface: missing any single item counts as failure.

【I. Hard requirements — all mandatory】

1. Single file, zero dependencies, offline-ready
   - All CSS / JS inlined in this one .html file;
   - No CDN, external scripts, external stylesheets, or web fonts (the meeting room may be offline; the file must survive for years);
   - Double-clicking it in Chrome/Edge (file:// protocol) must start the show;
   - Images must be inline SVG or base64; charts must be hand-drawn inline SVG (editable, tiny) — never bitmap screenshots.

2. Slide format
   - 16:9, designed at 1280×720 px, auto-scaling to any window size;
   - Keyboard: ←/→/Space/PageUp/PageDown to navigate, Home/End for first/last, F for fullscreen, Esc closes overlays;
   - Page counter "current/total" bottom-right, thin progress bar at the bottom;
   - URL hash deep links (#5 opens slide 5 directly);
   - While focus is inside an editable region, navigation keys must be disabled (typing must not turn pages).

3. In-browser editing (capability one)
   - Toggle edit mode with the E key or a toolbar button;
   - In edit mode every slide is contenteditable — click text to change it, with a clear visual cue (highlight border + status chip);
   - Paste is intercepted and inserted as plain text via the standard Selection/Range API (newlines become br elements) — do not rely on the deprecated document.execCommand (fallback only); note that manual insertion fires no input event, so dispatch one on the slide afterwards to drive autosave;
   - All edits autosave to localStorage (400 ms debounce), key format "agent-deck:" + deck-id + ":v" + version;
   - On reopening, if the stash differs from the file content, show a top banner offering "Restore / Discard";
   - In edit mode, detect in real time whether the current slide's content overflows the slide height (overflow gets cropped in both presentation and PDF); warn visibly (red border + toast) and clear the flag on exiting edit mode and on serialization.

4. Change log & saving (capability two · record)
   - <head> carries two meta tags: deck-id (globally unique; build it from topic+date) and deck-version (starts at 1);
   - The end of <body> carries <script type="application/json" id="revision-log">[]</script> as the embedded revision log;
   - A "Save new version" toolbar button: prompt me for a one-line change note → version +1 → append note and timestamp to the revision log → serialize the whole page ('<!DOCTYPE html>\n' + document.documentElement.outerHTML) and save it as title_v{two-digit version}_YYYYMMDD.html;
   - Prefer the File System Access API for saving (showSaveFilePicker — a system save dialog that writes straight back to the original folder); if the user cancels, roll back the version bump and the just-appended log entry; fall back to a Blob download when the API is unavailable or fails;
   - Before serializing, exit edit mode and close all overlays so the downloaded file is clean;
   - When writing the revision log, escape "<" in the JSON string as the Unicode escape sequence (backslash+u003c) so a change note can never terminate the script element;
   - Critical: nowhere in the inline script — including JS comments and string literals — may the character sequence "</" immediately followed by "script" appear; the HTML parser truncates the script right there and every feature dies;
   - A "History" toolbar button lists all revision entries (version, time, note) — HTML-escape notes before rendering;
   - After a successful save, clear the previous version's localStorage stash;
   - Intercept Ctrl/Cmd+S and route it to "Save new version" — the browser's native "save page" writes the original file from disk, silently losing edits while the user believes they saved; this trap must be sealed.

5. One-click PDF export (capability two · export)
   - An "Export PDF" toolbar button: exit edit mode, close overlays, then call window.print();
   - Print CSS must achieve: @page { size: 1280px 720px; margin: 0; } (exactly a PowerPoint 16:9 page); each slide exactly one page (page-break-after: always; the last slide set to auto to avoid a trailing blank page); hide all toolbars, counters, progress bars, overlays, hint texts; apply -webkit-print-color-adjust: exact and print-color-adjust: exact everywhere to keep backgrounds; the deck container must drop its scaling transform (transform: none !important) and positioning so slides flow in document order;
   - On click, show a non-blocking hint: in the print dialog choose "Save as PDF", check "Background graphics", uncheck "Headers and footers";
   - Also listen to window's beforeprint event (when the user bypasses the button with Ctrl+P or the menu, still auto-exit edit mode and close overlays before printing).

6. Presentation UI
   - A pill-shaped floating toolbar centered at the bottom: ◀ ▶ | Edit | Save new version | History | Export PDF | Fullscreen | ?;
   - Stealth while presenting: the toolbar is fully hidden at rest (opacity 0 and pointer-events none), fades in on mouse movement, fades out after ~2.5 s idle, and stays visible in edit mode; while idle also hide the mouse cursor (cursor:none) — the audience must see zero traces of tooling; show the toolbar for a few seconds after load for discoverability, and mention "move the mouse to summon the toolbar" on the cover and in the help overlay;
   - A "?" help overlay: keyboard shortcuts, editing & saving explanation, and the three PDF print-dialog settings;
   - Expose a window.deck object (go/next/prev/toggleEdit/saveVersion/exportPDF/serialize/version) for future automation.

7. Machine-checkable anchors (required for automated conformance checking)
   - Fixed ids: toolbar, counter (page counter), restore (restore banner), revision-log;
   - Fixed classes: .slide, .slide.active (current), body.editing (edit mode), .slide.overflow (over-tall warning);
   - The meta names (deck-id / deck-version), the localStorage prefix (agent-deck:) and the window.deck API signature as specified above;
   - Keep these anchors intact and the repository's conformance checker (checker/check.mjs) can run the full acceptance checklist against any deck automatically.

8. Speaker notes & presenter view (optional enhancement: recommended, not counted as an acceptance failure)
   - Each slide may carry an <aside class="notes"> block: always hidden in presentation and print; shown as a distinct editable block in edit mode, with an empty one auto-added to note-less slides on entering edit mode;
   - The S key or a "Presenter" toolbar button opens a popup presenter view: current notes, next-slide preview, page counter, elapsed timer; the popup's DOM is driven entirely by the main window — write no script inside the popup (avoids F2 script truncation);
   - The overflow check must temporarily exclude note blocks to avoid false positives; serialization strips empty note blocks to keep archives clean.

【II. Design requirements】

- Academic, light theme: white background #ffffff, body text #1a2332, primary #0f4c81 (deep blue), secondary #1a7f8e (teal), light line #dde4ec, light fill #f4f7fa; restrained and clean, no flashy animations;
- Font stack: -apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Malgun Gothic", sans-serif (no external fonts; covers Latin/Chinese/Korean);
- Body text ≥ 22px (at the 1280×720 design size) for projector readability; restrained information density — one key point per slide;
- Uniform section headers: a small letter-spaced kicker (e.g. "01 · PROGRESS") + a large title + a short primary-color underline.

【III. Content】

Build the slides from this outline (where I left gaps, fill in conventional placeholders marked with 【】 for me to complete):

- Cover: title 【…】, presenter 【…】, advisor 【…】, date 【…】
- Progress overview (last week's commitments + one-sentence summary)
- 【…paste your outline / material here…】
- Questions for discussion (each item with "my inclination")
- Next week's plan (each item with a verifiable completion criterion)

【IV. Self-check after generation】

Re-check items 1–7 of Part I one by one and output a self-check table at the end of your reply (tick each item or explain the deviation). Then sweep the Failure Mode Catalog (F1–F9). Do not drop any capability to "simplify the implementation".
```

---

## B. Incrementally modify an existing file (daily driver)

Send the agent your current `xxx_v03_20260707.html` (file or pasted content), plus:

```text
This is my agent-deck-format HTML slide deck (single file, zero dependencies, E-key in-browser editing, embedded revision log, window.print PDF export).
Keeping ALL existing capabilities and the visual style intact, make the following changes:

1. 【e.g.: add a "Robustness checks" slide after "Key results", content: …】
2. 【e.g.: turn the bar chart on slide 5 into a line chart, data: …】

Requirements:
- No external dependencies; do not break the meta deck-id / deck-version / revision-log structure;
- New slides must follow the .slide structure with the slide-foot footer; charts as inline SVG;
- Return the complete single-file HTML (never fragments).
```

---

## C. Migrate from an old PPT

```text
Attached is my old PPT (or: below is the per-slide text of my PPT).
Convert it into a single-file HTML slide deck satisfying this contract:
【paste Part I "Hard requirements" and Part II "Design requirements" from section A here】
Migration rules: one PPT slide → one slide; drop decorative elements; redraw charts as inline SVG;
mark content gaps with 【】 placeholders.
```

---

## Acceptance checklist (60 seconds after receiving the file)

| # | Action | Pass criterion |
|---|--------|----------------|
| 1 | Open by double-click while offline | Renders fine, no blank screen, no errors |
| 2 | Press → and Space | Pages turn; bottom-right counter updates |
| 3 | Press E, click a title, type | Text edits in place; navigation keys inert while editing |
| 4 | Edit something, then reload | "Restore / Discard" banner appears on top |
| 5 | Click "Save new version", enter a note | Downloads `title_v02_date.html`; opening it, "History" shows your note |
| 6 | "Export PDF" → Save as PDF | Page count = slide count; every page full 16:9, no cropping, no extra blank page, backgrounds intact |
| 7 | Open the PDF | No toolbar/counter/UI residue |
| 8 | Open with `#3` in the URL | Lands directly on slide 3 |

Any failure → send that row back to the agent verbatim: "Acceptance item X failed, symptom: …, fix and return the complete file."

---

## Failure Mode Catalog (F1–F9)

A shared vocabulary across agents: report bugs by number ("you committed F2 — fix it and resubmit"). Generating agents should sweep this catalog before delivering.

| # | Failure mode | Symptom | Fix |
|---|--------------|---------|-----|
| F1 | External dependency leak | Works online, blank page / wrong fonts offline | Remove CDNs & web fonts; redraw charts as inline SVG; base64 photos if truly needed |
| F2 | Script truncation | Nothing responds after opening — no keys, no buttons | Nowhere in the inline JS (including comments and strings) may "</" immediately followed by "script" appear; escape "<" before writing JSON |
| F3 | Over-tall content cropped | Bottom of a slide missing in presentation or PDF | Split the slide; implement the edit-mode overflow warning |
| F4 | Trailing blank page | PDF has one more page than the deck | Set the last .slide's page break to auto |
| F5 | UI residue in print | Toolbar / counter / overlays visible in the PDF | Hide all presentation UI in print CSS; listen to beforeprint |
| F6 | Edit state leaks into the archive | Saved file carries edit highlights or contenteditable | Exit edit mode, close overlays and strip state classes before serializing |
| F7 | Navigation keys hijack typing | Typing turns pages while editing | Guard key handling with isContentEditable; navigation keys inert inside editable focus |
| F8 | Machine-check anchor drift | Checker fails across the board; deck can't be auto-verified | Keep contract item 7's fixed ids / classes / meta names / prefix / API signature |
| F9 | Version mechanism broken | "Save new version" errors or revision log lost | Don't restructure revision-log; version only increments; cancel must roll back |
