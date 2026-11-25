// Inspection helper: writes 2x pixel-exact crops of out/entry.png into ./zoom/
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
import { chromium } from 'playwright-core';
const exe = process.env.CHROMIUM_PATH || path.join(os.homedir(), '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell');
const b64 = fs.readFileSync('out/entry.png').toString('base64');
const crops = { heroL: [0, 0, 512, 400], heroR: [512, 0, 512, 400], cardsTL: [0, 390, 512, 320], cardsTR: [512, 390, 512, 320], cardsBL: [0, 700, 512, 324], cardsBR: [512, 700, 512, 324] };
fs.mkdirSync('zoom', { recursive: true });
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
for (const [name, [x, y, w, h]] of Object.entries(crops)) {
  const page = await browser.newPage({ viewport: { width: w * 2, height: h * 2 } });
  await page.setContent(`<body style="margin:0;overflow:hidden"><img src="data:image/png;base64,${b64}" style="position:absolute;left:${-x * 2}px;top:${-y * 2}px;width:2048px;height:2048px;image-rendering:pixelated">`);
  await page.screenshot({ path: `zoom/${name}.png` });
  await page.close();
}
await browser.close();
