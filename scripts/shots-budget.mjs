import { chromium } from 'playwright-core';
const base = process.env.BASE || 'http://localhost:8787';
const subs = (process.env.SUBS || 'kr,cn,us,ca,eu,jp,au,in,dev,nf,win').split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const [w, h, tag, dsf] of [[1440, 1000, 'desktop-1440', 1], [390, 844, 'mobile-390', 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(base + '/insights/keywords/#budget', { waitUntil: 'networkidle' });
  for (const s of subs) {
    await p.click(`#st-${s}`);
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await p.waitForTimeout(200);
    const full = await p.evaluate(() => document.body.scrollHeight);
    await p.screenshot({ path: `screens/budget-${s}-${tag}.png`, fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(full, w < 500 ? 3200 : 2600) } });
  }
  // 모바일: 표를 가로로 스크롤한 상태(고정 첫 열 확인)
  if (w < 500) {
    await p.click('#st-cn');
    await p.evaluate(() => { const t = document.querySelector('#sp-cn .ywrap'); t.scrollLeft = 600; t.scrollIntoView({ block: 'start' }); window.scrollBy(0, -130); });
    await p.waitForTimeout(200);
    await p.screenshot({ path: `screens/budget-cn-scrolled-${tag}.png` });
  }
  console.log(tag, 'errors', errs);
  await p.close();
}
await b.close();
