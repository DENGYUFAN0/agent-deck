#!/usr/bin/env node
/**
 * agent-deck 合规校验器（conformance checker）
 *
 * 用法: node check.mjs <deck.html>
 *
 * 把 PROMPT.md 验收清单里机器可测的部分自动化：任何 agent 生成的 deck
 * 都能被机器验收，而不是靠人肉 60 秒。零依赖红线约束的是 deck 文件本身，
 * 不约束本工具（它是仓库的检验设备）。
 *
 * 依赖 Playwright（Chromium 系）。本机没装 Playwright 浏览器时，
 * 会依次回退到系统 Edge / Chrome。
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const argPath = process.argv[2];
if (!argPath) {
  console.error('用法: node check.mjs <deck.html>');
  process.exit(2);
}
const absPath = path.resolve(argPath);
const source = fs.readFileSync(absPath, 'utf8');
console.log(`agent-deck 合规校验: ${absPath}`);

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? '  — ' + detail : ''}`);
}
function warn(name, detail = '') {
  console.log(`  ! ${name}${detail ? '  — ' + detail : ''}（警告，不计失败）`);
}

/* ================= 静态检查 ================= */
console.log('\n[静态检查]');
check('无外部资源引用（script src / 外链样式 / @import / url(http)）',
  !/<script[^>]+\bsrc\s*=|<link\s[^>]*\bhref\s*=\s*["']https?:|@import\s|url\(\s*["']?https?:/i.test(source));
check('打印页面尺寸 @page size:1280px 720px',
  /@page\s*\{[^}]*size\s*:\s*1280px\s+720px/i.test(source));
check('meta deck-id 存在', /<meta\s+name="deck-id"\s+content="[^"]+"/.test(source));
check('meta deck-version 存在', /<meta\s+name="deck-version"\s+content="\d+"/.test(source));
check('内嵌版本记录 revision-log 存在',
  /<script\s+type="application\/json"\s+id="revision-log">/.test(source));
check('保存实现：File System Access API + 下载兜底',
  /showSaveFilePicker/.test(source) && /\.download\s*=/.test(source));
check('母版内容界标存在（CONTENT-START / CONTENT-END）',
  source.includes('CONTENT-START') && source.includes('CONTENT-END'));

/* ====== 本地服务器：只供本文件，其余一切请求拦截（等价断网） ====== */
const server = http.createServer((req, res) => {
  if (req.url.split('?')[0] === '/deck.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(source);
  } else { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/deck.html`;

async function launch() {
  const tries = [{}, { channel: 'msedge' }, { channel: 'chrome' }];
  for (const opt of tries) {
    try { return await chromium.launch(opt); } catch (e) { /* 下一个 */ }
  }
  console.error('\n找不到 Chromium 系浏览器。请运行: npx playwright install chromium');
  process.exit(2);
}
const browser = await launch();

let exitCode = 1;
try {
  const context = await browser.newContext();
  const externalHits = [];
  await context.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(url)) return route.continue();
    if (u.endsWith('/favicon.ico')) return route.fulfill({ status: 204, body: '' });
    externalHits.push(u);
    return route.abort();
  });

  const page = await context.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') jsErrors.push('console: ' + m.text()); });

  /* ================= 加载与放映 ================= */
  console.log('\n[加载与放映]');
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  check('加载无 JS 报错', jsErrors.length === 0, jsErrors.slice(0, 2).join(' | '));
  check('零外部网络请求（断网可用）', externalHits.length === 0, externalHits.slice(0, 2).join(' | '));

  /* 舞台几何：不依赖 window.deck，任何 deck 都测——从零实现最高发的翻车点 */
  const geo = await page.evaluate(() => {
    const s = document.querySelector('.slide.active') || document.querySelector('.slide');
    if (!s) return null;
    const r = s.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    return {
      inside: r.left >= -2 && r.top >= -2 && r.right <= vw + 2 && r.bottom <= vh + 2,
      cx: Math.abs((r.left + r.right) / 2 - vw / 2) < 8,
      cy: Math.abs((r.top + r.bottom) / 2 - vh / 2) < 8,
      fill: r.width >= vw - 4 || r.height >= vh - 4
    };
  });
  check('舞台几何：活动页完整可见、居中、等比充满视口',
    !!geo && geo.inside && geo.cx && geo.cy && geo.fill,
    geo ? (geo.inside ? '' : '活动页超出视口——舞台居中/缩放数学有误') : '找不到 .slide');

  const missingApi = await page.evaluate(() => {
    const need = ['go', 'next', 'prev', 'toggleEdit', 'saveVersion', 'exportPDF', 'serialize', 'version'];
    return (window.deck && typeof window.deck === 'object')
      ? need.filter(k => typeof window.deck[k] !== 'function') : need;
  });
  check('window.deck API 完整（脚本未被截断的铁证）', missingApi.length === 0,
    missingApi.length ? '缺: ' + missingApi.join(',') : '');

  if (missingApi.length === 0) {
    const ver0 = await page.evaluate(() => document.querySelector('meta[name="deck-version"]').content);
    const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
    check('幻灯片数 ≥ 2', slideCount >= 2, `共 ${slideCount} 页`);

    const c0 = await page.textContent('#counter');
    await page.keyboard.press('ArrowRight');
    const c1 = await page.textContent('#counter');
    check('键盘翻页生效', c0 !== c1, `${c0} → ${c1}`);

    await page.evaluate(() => { location.hash = '#3'; });
    const deep = await page.evaluate(() => {
      const slides = Array.from(document.querySelectorAll('.slide'));
      return slides.findIndex(s => s.classList.contains('active')) + 1;
    });
    check('井号深链直达（#3）', deep === 3, `落在第 ${deep} 页`);

    /* ================= 打印与 PDF ================= */
    console.log('\n[打印与 PDF]');
    await page.emulateMedia({ media: 'print' });
    const pr = await page.evaluate(() => {
      const slides = Array.from(document.querySelectorAll('.slide'));
      const tb = document.getElementById('toolbar');
      return {
        all: slides.every(s => getComputedStyle(s).display !== 'none'),
        tbHidden: !tb || getComputedStyle(tb).display === 'none'
      };
    });
    check('打印态所有幻灯片可见（一片一页的前提）', pr.all);
    check('打印态工具栏隐藏', pr.tbHidden);
    /* 复位为默认（不能强制 screen：emulateMedia 会覆盖 page.pdf 的打印媒体） */
    await page.emulateMedia({ media: null });

    let pdfPages = -1, mediaBoxOk = false;
    try {
      const pdf = await page.pdf({ preferCSSPageSize: true });
      const raw = pdf.toString('latin1');
      pdfPages = (raw.match(/\/Type\s*\/Page(?![a-zA-Z])/g) || []).length;
      mediaBoxOk = /\/MediaBox\s*\[\s*0 0 960 540/.test(raw);
    } catch (e) { warn('page.pdf 在此浏览器不可用', e.message.split('\n')[0]); }
    if (pdfPages >= 0) {
      check('PDF 页数 = 幻灯片数（无空白页）', pdfPages === slideCount, `PDF ${pdfPages} 页 / 幻灯 ${slideCount} 页`);
      if (mediaBoxOk) check('PDF 页面尺寸 16:9（960×540pt = 1280×720px）', true);
      else warn('PDF MediaBox 未解析出 960×540pt', '请人工核对一次导出尺寸');
    }

    /* ================= 编辑与暂存 ================= */
    console.log('\n[编辑与暂存]');
    await page.keyboard.press('e');
    const editOn = await page.evaluate(() => ({
      editable: document.querySelector('.slide.active').isContentEditable,
      cls: document.body.classList.contains('editing')
    }));
    check('E 键进入编辑模式', editOn.editable && editOn.cls);

    await page.click('.slide.active h2');
    const cb = await page.textContent('#counter');
    await page.keyboard.press('ArrowRight');
    const ca = await page.textContent('#counter');
    check('编辑聚焦时翻页键锁定（打字不翻页）', cb === ca);

    await page.keyboard.type(' AGENTDECKMARK');
    await page.waitForTimeout(900); /* > 400ms 防抖 */
    const ls = await page.evaluate(() => {
      const k = Object.keys(localStorage).find(x => x.startsWith('agent-deck:'));
      return k ? { key: k, hasMark: localStorage.getItem(k).includes('AGENTDECKMARK') } : null;
    });
    check('修改自动暂存 localStorage（agent-deck: 前缀）', !!ls && ls.hasMark, ls ? ls.key : '未找到暂存 key');

    const paste = await page.evaluate(() => {
      const h2 = document.querySelector('.slide.active h2');
      const range = document.createRange(); range.selectNodeContents(h2); range.collapse(false);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      const dt = new DataTransfer();
      dt.setData('text/plain', 'PASTEMARK');
      dt.setData('text/html', '<b>RICHMARK</b>');
      h2.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      return { plain: h2.textContent.includes('PASTEMARK'), rich: !!h2.querySelector('b') || h2.innerHTML.includes('RICHMARK') };
    });
    check('粘贴转纯文本（富文本被剥离）', paste.plain && !paste.rich);

    const over = await page.evaluate(() => {
      const s = document.querySelector('.slide.active');
      const p = document.createElement('p');
      p.textContent = '超高检测用长内容。'.repeat(600);
      s.appendChild(p);
      s.dispatchEvent(new Event('input', { bubbles: true }));
      const flagged = s.classList.contains('overflow');
      p.remove();
      s.dispatchEvent(new Event('input', { bubbles: true }));
      return { flagged, cleared: !s.classList.contains('overflow') };
    });
    check('内容超高警告（overflow 标记，超出即警示）', over.flagged && over.cleared);

    await page.evaluate(() => { window.__pc = false; window.prompt = () => { window.__pc = true; return null; }; });
    await page.keyboard.press('Control+s');
    const cs = await page.evaluate(() => ({
      called: window.__pc,
      ver: document.querySelector('meta[name="deck-version"]').content
    }));
    check('Ctrl+S 被拦截为「保存新版本」', cs.called);
    check('取消保存时版本号不变', cs.ver === ver0, `v${ver0} → v${cs.ver}`);

    const bp = await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeprint'));
      return !document.body.classList.contains('editing');
    });
    check('beforeprint 自动退出编辑（Ctrl+P 兜底）', bp);

    const sz = await page.evaluate(() => {
      window.deck.toggleEdit(true); /* 先回编辑态，验证 serialize 会自己收干净 */
      const html = window.deck.serialize();
      const bodyTag = (html.match(/<body[^>]*>/) || [''])[0];
      return {
        doctype: html.startsWith('<!DOCTYPE html>'),
        rev: html.includes('id="revision-log"'),
        mark: html.includes('AGENTDECKMARK'),
        clean: !/contenteditable="true"/.test(html) && !/editing|ui-visible/.test(bodyTag)
      };
    });
    check('序列化以 DOCTYPE 开头', sz.doctype);
    check('序列化包含版本记录与当前修改', sz.rev && sz.mark);
    check('序列化无编辑态残留', sz.clean);

    /* ================= 恢复横幅 ================= */
    console.log('\n[恢复横幅]');
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(400);
    const restore = await page.evaluate(() => {
      const el = document.getElementById('restore');
      return el ? !el.hidden : false;
    });
    check('重开文件出现「恢复修改 / 丢弃」横幅', restore);
  }

  const failed = results.filter(r => !r.ok);
  console.log(`\n结果: ${results.length - failed.length}/${results.length} 通过`);
  if (failed.length) console.log('未通过: ' + failed.map(f => f.name).join('；'));
  exitCode = failed.length ? 1 : 0;
} finally {
  await browser.close();
  server.close();
}
process.exit(exitCode);
