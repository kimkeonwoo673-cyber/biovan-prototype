// 키워드·시장 분석 페이지 동작 점검: 모든 탭 클릭, 지연 로드 3개, 하위 탭, JS 오류, 해시 딥링크
import { chromium } from 'playwright-core';
const base = process.env.BASE || 'http://localhost:8787';
const url = base + (process.env.IPATH || '/insights/keywords/');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [], bad = [];
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
p.on('response', (r) => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
await p.goto(url, { waitUntil: 'networkidle' });
const tabs = await p.$$eval('[data-main] [role=tab]', (ts) => ts.map((t) => t.dataset.tab));
const out = {};
for (const t of tabs) {
  await p.click(`#t-${t}`);
  const lazy = await p.$(`#p-${t} [data-lazy]`);
  if (lazy) await p.waitForSelector(`#p-${t}[data-loaded="1"]`, { timeout: 15000 });
  out[t] = await p.$eval(`#p-${t}`, (el) => ({ hidden: el.hidden, h: el.offsetHeight, tables: el.querySelectorAll('table').length, svgs: el.querySelectorAll('svg').length, subtabs: el.querySelectorAll('[data-sub] [role=tab]').length, ready: el.querySelectorAll('[data-sub][data-ready]').length }));
}
// 하위 탭 동작(지연 로드된 영상·예산)
for (const [tab, st, sp] of [['video', '#vt-peer', '#vp-peer'], ['budget', '#st-cn', '#sp-cn'], ['budget', '#st-win', '#sp-win']]) {
  await p.click(`#t-${tab}`); await p.click(st);
  out[`sub:${st}`] = await p.$eval(sp, (el) => !el.hidden && el.offsetHeight > 50);
}
// 해시 딥링크
const p2 = await b.newPage(); p2.on('pageerror', (e) => errs.push('p2 pageerror: ' + e.message));
await p2.goto(url + '#video', { waitUntil: 'networkidle' });
await p2.waitForSelector('#p-video[data-loaded="1"]', { timeout: 15000 });
out.deeplink = await p2.$eval('#p-video', (el) => !el.hidden && el.querySelectorAll('.vtop').length);
console.log(JSON.stringify(out, null, 1));
console.log('errors:', errs.length ? errs : 'none'); console.log('http>=400:', bad.length ? bad : 'none');
await b.close();
