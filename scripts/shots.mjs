import { chromium } from 'playwright-core';
const base = process.env.BASE || 'http://localhost:8787';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
async function shot(path, w, file, full = true) {
  const p = await b.newPage({ viewport: { width: w, height: w < 500 ? 844 : 900 }, deviceScaleFactor: w < 500 ? 2 : 1 });
  await p.goto(base + path, { waitUntil: 'networkidle' });
  // trigger reveal/counters
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({top: y, behavior: 'instant'}); await new Promise(r => setTimeout(r, 60)); } window.scrollTo({top: 0, behavior: 'instant'}); });
  await p.waitForTimeout(1600);
  await p.screenshot({ path: 'screens/' + file, fullPage: full });
  await p.close();
}
const list = (process.env.SHOTS || 'home-desktop-1440.png|/|1440,home-mobile-390.png|/|390,projects-desktop-1440.png|/projects/|1440').split(',');
for (const s of list) { const [f, path, w] = s.split('|'); await shot(path, +w, f); console.log('saved', f); }
await b.close();
