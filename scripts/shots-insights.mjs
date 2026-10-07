import { chromium } from 'playwright-core';
const base = process.env.BASE || 'http://localhost:8787';
const path = process.env.IPATH || '/insights/keywords/';
const tabs = (process.env.TABS || 'summary,w10,w5,w2,comp,budget,forecast,tech,video,sources,reco').split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const [w, h, tag, dsf] of [[1440, 1000, 'desktop-1440', 1], [390, 844, 'mobile-390', 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
  await p.goto(base + path, { waitUntil: 'networkidle' });
  for (const t of tabs) {
    await p.click(`#t-${t}`);
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await p.waitForTimeout(250);
    const full = await p.evaluate(() => document.body.scrollHeight);
    await p.screenshot({ path: `screens/insights-${t}-${tag}.png`, fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(full, w < 500 ? 2600 : 2200) } });
    console.log('saved', t, tag, full);
  }
  await p.close();
}
await b.close();
