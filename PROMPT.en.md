# PROMPT.en.md — Universal Prompt (paste into any AI agent)

> **Translation notice:** this is an English translation of [PROMPT.md](PROMPT.md). If the two ever disagree, **the Chinese version is canonical.**
>
> **Default to section A "template fill"**: hand `template.html` (the golden master) to any AI agent — the machinery travels with the master, the model only fills in content, so even mid-tier models get it right in one shot.
> Use section A+ "from scratch" only when developing a new master (strongest models only). Section B edits an existing file (daily driver), section C migrates from PPT.
> After generation, run the 60-second acceptance checklist at the bottom; paste any failed item back to the agent verbatim.

---

## Scenario → master routing (step zero, before writing anything)

| Scenario | Master | Character |
|----------|--------|-----------|
| Lab meeting / thesis defense / academic conference / course | template.html (academic light · canonical) | Restrained, white, projector-friendly |
| Fundraising pitch / product launch / client proposal / annual review | masters/corporate.html (corporate dark) | Dark, big numbers, conclusion-first |

If the scenario is ambiguous, ask the user one question first. The layout menu follows **the chosen master's** page order; corporate master pages: 1 cover / 2 problem / 3 solution / 4 market (big-number stats) / 5 traction (chart) / 6 business model (table) / 7 milestones (roadmap) / 8 team & ask.

The corporate master carries a "✂ THEME-TOKENS ✂" brand-token zone: **with the user's confirmation**, its CSS variables may be swapped to the client's brand colors — everything outside the token zone remains off-limits, and the two iron rules stand.

**Pick the mode by model tier**: mid/weak models → section A template fill (copy the recipes — the empirically 31/31 path); strong models → A + A-pro by default, and when the user explicitly asks for creativity → **A-max creative mode**.

---

## A. Template fill (default mode — works with any model)

Send `template.html` (the master) to the agent together with the block below; in a chat that can't take files, paste the master's full text after the prompt.

```text
Build a new deck for me on top of the attached agent-deck master. The master carries all the machinery (presenting / live editing / versioned saving / PDF export); you are responsible for content only, never for machinery.

【Two iron rules】
1. You may only modify what lies between the two markers "✂ CONTENT-START ✂" and "✂ CONTENT-END ✂", plus the <title> text and the content value of meta deck-id (set it to topic-slug-date). Outside the markers — <style>, <script>, the toolbar, every overlay, meta deck-version — do not touch a single character, and do not "helpfully optimize" anything.
2. Inside the markers, use only the structures from the component manual below: invent no new class names, write no <script>, pull in no external resources; draw charts as inline SVG with data-label / data-value attributes on the shapes (keep the static values printed at the top of the bars — they are the PDF fallback).

【Component manual】(every component has a live example in the master — copy the structure, swap the content)
- Regular slide: <section class="slide"> content… <div class="slide-foot"><span>short title</span><span class="foot-num"></span></div> </section>
- Cover slide: <section class="slide cover">: .kicker + h1 + .subtitle + .meta + aside.notes + .cover-hint
- Section header: <p class="kicker">01 · SECTION</p> + <h2>Title</h2>
- Two columns: <div class="cols"><div class="col">…</div><div class="col">…</div></div>
- Key-point box: <div class="box">…</div>; question box: <div class="box ask"><b>1 · type</b> question + my inclination</div>
- Status tags: <span class="tag done">done</span> (also tag doing / tag risk)
- Table: <table><tr><th>…</th></tr><tr><td>…</td></tr></table>
- Roadmap: <ol class="roadmap"><li class="now"><b>③ Stage</b>note</li>…</ol> (mark the current stage with now)
- Chart: inline SVG (see master slide 5), rects with data-label/data-value, static values above bars
- Speaker notes: <aside class="notes">visible only in presenter view (S key)</aside>

【Layout menu】For every slide, first pick one of **the chosen master's** ready-made recipes and copy the corresponding slide's structure — never invent your own layout (below are the academic master's 7; corporate page order is in the routing table above):
cover = master slide 1 | two-column progress/comparison = slide 2 | roadmap = slide 3 | bullets + table = slide 4 | chart = slide 5 | questions = slide 6 | action list = slide 7

【Layout budget】Hard numbers — count them page by page before delivery; this is the lifeline against over-dense pages and overlapping text (F10):
- Exactly 1 kicker + 1 h2 per slide (cover excepted); body bullets ≤ 6 per slide, each ≤ 2 lines (~15 words);
- With two columns, ≤ 5 items per column; at most 1 table per slide, tables ≤ 5 rows × 4 columns; running paragraphs ≤ 3 lines, longer becomes bullets;
- 8–15 slides recommended per deck; when content doesn't fit, the ONLY legal fix is splitting the slide — never shrink font sizes, never add inline styles to squeeze line-height/margins, never absolutely-position content elements.

【Content】
- Scenario: 【lab meeting / thesis defense / project review / course presentation / any】
- Outline & material: 【paste here; fill gaps with 【】 placeholders per convention — never leave blanks, never fabricate】

【Pre-delivery self-check】
- Zero changes outside the markers (verify <style> and <script> are byte-identical to the master);
- Count every slide against the layout budget: bullets, lines per bullet, table rows/columns, paragraph lines — split slides when over;
- Sweep the Failure Mode Catalog (F1–F10) at the bottom — under template fill, F1 external dependencies, F3 overflow and F10 collisions are the main risks;
- Return the complete single-file HTML, never fragments.
```

---

## A-pro. Two-step generation (recommended for strong models — the biggest lever for content precision)

Step one asks for a plan, not HTML:

```text
Do NOT generate slides yet. From the scenario and outline below, produce a one-page plan (markdown table): one row per slide, columns = slide # / layout recipe (from the chosen master) / conclusion-style title / bullet summary (≤6) / chart & data points / one speaker note.
Scenario: 【lab meeting / pitch / …】  Master: 【academic / corporate】  Outline & material: 【…】
```

After the user annotates and confirms, send step two: "Following the confirmed plan, do section-A template fill and return the complete single-file HTML." Drift gets corrected at the cheap plan stage, an order of magnitude cheaper than reworking tens of KB of HTML.

---

## A-max. Creative mode (strong models only — channel creativity into layout and visual storytelling)

Applies when the model is strong **and the user explicitly asks for creativity**. Mid/weak models must stay on section A — three rounds of cross-agent evidence made this a guardrail, not gatekeeping. Best combined with A-pro: plan first, create after confirmation.

On top of section A's two iron rules, three whitelisted zones open up (everything else stays off-limits):

```text
1. Free-form layout inside the content markers: no longer bound to the layout menu — invent
   page structures and narrative rhythm (magazine openers, full-bleed quote slides, timeline
   spreads, asymmetric columns…), but every slide must remain a <section class="slide">…</section>,
   and the slide-foot / aside.notes conventions stay;
2. The <style id="custom-style"> zone for your own CSS: every new class must carry the .x- prefix
   (.x-hero / .x-quote / .x-timeline); additions only — never override machinery or base-component
   selectors; animation is allowed but restrained, and must degrade to nothing or a static
   equivalent in print (the L2 three questions still apply);
3. The ✂ THEME-TOKENS ✂ zone for re-theming: swap the palette wholesale with the user's
   confirmation (the academic canonical master stays uncolored by default).

Creative code of conduct (violations demote you back to section A):
- The machinery (<script> and presentation UI) stays byte-identical — creativity is not for
  reinventing the wheel;
- The layout budget and F10 still apply: freedom of composition, not freedom to overstuff;
- Every invented layout gets one line in the plan: which standard recipe it replaces and why
  it is better;
- Delivery must still pass all 32 checker items — the custom-style zone has a dedicated check,
  and any out-of-bounds selector fails it.
```

---

## A+. Full contract · runtime from scratch (advanced: only when developing a new master)

> **Warning**: this mode asks the model to implement ~600 lines of runtime machinery (stage geometry, serialization, print, saving…) from a prose spec — only the strongest models get it right in one pass. Field record: a mid-tier model got ~90% of the machinery logic right, then botched one line of stage-centering math, cropping every single slide. **For everyday decks use section A**; the full contract below also serves as the acceptance standard for every mode.

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
   - Content markers: "✂ CONTENT-START ✂" and "✂ CONTENT-END ✂" comments wrapping all slides (the mechanical boundary for template-fill mode);
   - The meta names (deck-id / deck-version), the localStorage prefix (agent-deck:) and the window.deck API signature as specified above;
   - Keep these anchors intact and the repository's conformance checker (checker/check.mjs) can run the full acceptance checklist against any deck automatically.

8. Speaker notes & presenter view (optional enhancement: recommended, not counted as an acceptance failure)
   - Each slide may carry an <aside class="notes"> block: always hidden in presentation and print; shown as a distinct editable block in edit mode, with an empty one auto-added to note-less slides on entering edit mode;
   - The S key or a "Presenter" toolbar button opens a popup presenter view: current notes, next-slide preview, page counter, elapsed timer; the popup's DOM is driven entirely by the main window — write no script inside the popup (avoids F2 script truncation);
   - The overflow check must temporarily exclude note blocks to avoid false positives; serialization strips empty note blocks to keep archives clean.

9. L2 expressiveness modules (all optional, scenario-dependent; before implementing any, it must pass three questions: still a single offline file / degrades in PDF to a predictable static rendering / edit mode unharmed)
   - Interactive charts (recommended first): SVG shapes carry data-label / data-value attributes; while presenting, hovering shows a "label: value" tooltip (one reusable fixed-position element, id=charttip); hovering is disabled in edit mode; the tooltip is hidden in print, and static values must be printed on the chart as the PDF fallback;
   - Other candidates (section map / progressive reveal / time-budget alert / overview mode / annotation layer) — see the module catalog and its three-question answers in METHODOLOGY §8.

【II. Design requirements】

- Academic, light theme: white background #ffffff, body text #1a2332, primary #0f4c81 (deep blue), secondary #1a7f8e (teal), light line #dde4ec, light fill #f4f7fa; restrained and clean, no flashy animations;
- Font stack: -apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Malgun Gothic", sans-serif (no external fonts; covers Latin/Chinese/Korean);
- Body text ≥ 22px (at the 1280×720 design size) for projector readability; restrained information density — one key point per slide;
- Visual asset priority: CSS / inline SVG vectors → tiny KB-scale bitmaps as base64 → photos as a last resort (compressed, base64) — asset forms must be compatible with the single-file constraint;
- Uniform section headers: a small letter-spaced kicker (e.g. "01 · PROGRESS") + a large title + a short primary-color underline;
- The same layout budget as section A applies (bullets ≤ 6, each ≤ 2 lines, at most 1 table per slide and ≤ 5×4, paragraphs ≤ 3 lines, split when it doesn't fit) — guards against overlapping text (F10).

【III. Content】

Build the slides from this outline (where I left gaps, fill in conventional placeholders marked with 【】 for me to complete):

- Cover: title 【…】, presenter 【…】, advisor 【…】, date 【…】
- Progress overview (last week's commitments + one-sentence summary)
- 【…paste your outline / material here…】
- Questions for discussion (each item with "my inclination")
- Next week's plan (each item with a verifiable completion criterion)

【IV. Self-check after generation】

Re-check items 1–7 of Part I one by one and output a self-check table at the end of your reply (tick each item or explain the deviation). Then sweep the Failure Mode Catalog (F1–F10). Do not drop any capability to "simplify the implementation".
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
Attached is my old PPT (or: below is the per-slide text of my PPT), together with the agent-deck master template.html.
Following section A's two iron rules and component manual, migrate the PPT content into the master:
one PPT slide → one slide; drop decorative elements; redraw charts as inline SVG (with data-label / data-value);
mark content gaps with 【】 placeholders; return the complete single-file HTML.
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

## Failure Mode Catalog (F1–F10)

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
| F10 | Layout collision (overlapping text) | Text overlaps; tables or bullets sliced by the footer | Obey the layout budget (bullets ≤6, ≤2 lines each, ≤1 table ≤5×4 per slide, paragraphs ≤3 lines); split slides; never shrink fonts, squeeze with inline styles, or absolutely-position content |
