// Builds index.html (self-contained) and renders ./out/entry.png (1024x1024).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { geoMercator, geoPath, geoGraticule } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { chromium } from 'playwright-core';
import { scenes } from './scenes.mjs';

const W = 1024, H = 1024;
const HERO_H = 388;

// ---------- palette ----------
const C = {
  navy: '#0C1626', navy2: '#13233B', land: '#294268', border: '#3F5A86',
  cream: '#F5F0E4', paper: '#F3EEE3', ink: '#0F1B2D', body: '#2A3445',
  red: '#E23D2B', redDark: '#C42F20', amber: '#F6B73C', green: '#2FD08A',
};

// ---------- fonts (base64-embedded) ----------
const font = (pkg, file) =>
  fs.readFileSync(`node_modules/@fontsource/${pkg}/files/${file}.woff2`).toString('base64');
const faces = [
  ['Playfair Display', 900, 'normal', font('playfair-display', 'playfair-display-latin-900-normal')],
  ['Playfair Display', 500, 'italic', font('playfair-display', 'playfair-display-latin-500-italic')],
  ['Barlow Condensed', 600, 'normal', font('barlow-condensed', 'barlow-condensed-latin-600-normal')],
  ['Barlow Condensed', 700, 'normal', font('barlow-condensed', 'barlow-condensed-latin-700-normal')],
  ['Inter', 500, 'normal', font('inter', 'inter-latin-500-normal')],
  ['Inter', 600, 'normal', font('inter', 'inter-latin-600-normal')],
];
const fontCss = faces.map(([fam, wt, st, b64]) =>
  `@font-face{font-family:'${fam}';font-weight:${wt};font-style:${st};src:url(data:font/woff2;base64,${b64}) format('woff2');}`
).join('\n');

// ---------- map ----------
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));
const land = feature(world, world.objects.land);
const borders = mesh(world, world.objects.countries, (a, b) => a !== b);

const LON0 = -133, LON1 = 95, LAT_BOTTOM = 18.2;
const scale = W / ((LON1 - LON0) * Math.PI / 180);
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
const projection = geoMercator()
  .scale(scale)
  .translate([-scale * LON0 * Math.PI / 180, HERO_H + scale * merc(LAT_BOTTOM)])
  .clipExtent([[-2, -2], [W + 2, HERO_H + 2]]);
const gp = geoPath(projection).digits(1);
const graticule = geoGraticule().step([15, 15])();

const stories = [
  {
    n: 1, lon: -121.95, lat: 37.35, mapLabel: 'SANTA CLARA', topic: 'NVIDIA CEO REINSTATED', lx: 20, ly: -1, anchor: 'start',
    kicker: 'Santa Clara, U.S.',
    head: 'Nvidia board reinstates Jensen Huang after Trump steps in',
    body: 'The chipmaker’s founder is back as CEO; its shares jump 30%.',
  },
  {
    n: 2, lon: -73.95, lat: 40.65, mapLabel: 'BROOKLYN, NEW YORK', topic: 'HUAWEI VERDICT', lx: 20, ly: -1, anchor: 'start',
    kicker: 'Brooklyn, New York',
    head: 'Huawei found guilty on 10 of 12 counts',
    body: 'A Brooklyn jury convicts it of bank fraud and plotting to steal trade secrets, but clears it of racketeering.',
  },
  {
    n: 3, lon: 56.5, lat: 26.5, mapLabel: 'STRAIT OF HORMUZ', topic: 'TANKER HIT', lx: 20, ly: -1, anchor: 'start',
    kicker: 'Strait of Hormuz',
    head: '<mark>Iran says</mark> tanker hit a mine and caught fire',
    body: 'UK reports point instead to an unidentified projectile. What hit the ship is unconfirmed.',
  },
  {
    n: 4, lon: 20.07, lat: 32.1, mapLabel: 'BENGHAZI', topic: 'DRONE STRIKES CLAIMED', lx: -20, ly: -1, anchor: 'end',
    kicker: 'Off Libya · Benghazi',
    head: '<mark>Ukraine claims</mark> drone strikes on Russian ships off Libya',
    body: 'One ship was hit in Benghazi’s port, far from the front lines.',
  },
  {
    n: 5, lon: 28.2, lat: 59.4, mapLabel: 'NARVA', topic: '‘OPEN WAR’ WARNING', lx: 20, ly: -1, anchor: 'start',
    kicker: 'Narva · Estonia–Russia border',
    head: 'Russia warns Estonia of ‘open war’ over border closure',
    body: 'Tallinn plans to shut its crossings with Russia from 1 December.',
  },
  {
    n: 6, lon: 34.4, lat: 31.4, mapLabel: 'GAZA', topic: 'ISRAELI AIRSTRIKE', lx: 6, ly: -41, anchor: 'start',
    kicker: 'Gaza Strip',
    head: 'Israeli airstrike kills Hamas security chief Naim Abu Nahal',
    body: 'He headed Hamas’s internal security in the Gaza Strip.',
  },
];

const pins = stories.map((s) => {
  const [x, y] = projection([s.lon, s.lat]);
  return `
  <g transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
    <circle r="40" fill="url(#pinGlow)"/>
    <circle r="20" fill="none" stroke="${C.red}" stroke-width="1.5" opacity=".65"/>
    <circle r="12.5" fill="${C.red}" stroke="#fff" stroke-width="2"/>
    <text y="5.6" text-anchor="middle" class="pin-n">${s.n}</text>
    <text x="${s.lx}" y="${s.ly}" text-anchor="${s.anchor}" class="pin-l">${s.mapLabel}</text>
    <text x="${s.lx}" y="${s.ly + 17}" text-anchor="${s.anchor}" class="pin-t">${s.topic}</text>
  </g>`;
}).join('');

const mapSvg = `
<svg class="map" width="${W}" height="${HERO_H}" viewBox="0 0 ${W} ${HERO_H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ocean" cx="50%" cy="62%" r="75%">
      <stop offset="0" stop-color="#16294A"/><stop offset="1" stop-color="${C.navy}"/>
    </radialGradient>
    <radialGradient id="pinGlow">
      <stop offset="0" stop-color="${C.red}" stop-opacity=".55"/>
      <stop offset="1" stop-color="${C.red}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.navy}" stop-opacity="1"/>
      <stop offset=".5" stop-color="${C.navy}" stop-opacity=".97"/>
      <stop offset=".7" stop-color="${C.navy}" stop-opacity=".8"/>
      <stop offset=".86" stop-color="${C.navy}" stop-opacity=".38"/>
      <stop offset="1" stop-color="${C.navy}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${HERO_H}" fill="url(#ocean)"/>
  <path d="${gp(graticule)}" fill="none" stroke="#2B4064" stroke-width=".6" opacity=".55"/>
  <path d="${gp(land)}" fill="${C.land}" stroke="#6583B3" stroke-width=".9"/>
  <path d="${gp(borders)}" fill="none" stroke="${C.border}" stroke-width=".6"/>
  <rect width="${W}" height="168" fill="url(#topFade)"/>
  ${pins}
</svg>`;

// ---------- cards ----------
const cards = stories.map((s) => `
  <article class="card${s.n <= 2 ? ' lead' : ''}">
    <div class="tile">${scenes[s.n - 1]}</div>
    <div class="txt">
      <div class="kicker"><span class="num">${s.n}</span><span class="place">${s.kicker}</span></div>
      <h2>${s.head}</h2>
      <p>${s.body}</p>
    </div>
  </article>`).join('');

// ---------- page ----------
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>The world on Tuesday, 24 November 2026</title>
<style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:${C.paper};color:${C.ink};font-family:'Inter',sans-serif;position:relative;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.hero{position:absolute;left:0;top:0;width:${W}px;height:${HERO_H}px;background:${C.navy};overflow:hidden;
  border-bottom:5px solid ${C.red}}
.map{position:absolute;left:0;top:0;display:block}
.pin-n{font:700 17px 'Barlow Condensed';fill:#fff}
.pin-l{font:700 16px 'Barlow Condensed';letter-spacing:.09em;fill:${C.cream};
  paint-order:stroke;stroke:${C.navy};stroke-width:4px;stroke-linejoin:round}
.pin-t{font:600 15px 'Barlow Condensed';letter-spacing:.07em;fill:${C.amber};
  paint-order:stroke;stroke:${C.navy};stroke-width:4px;stroke-linejoin:round}
.head{position:absolute;left:28px;right:28px;top:17px;display:flex;justify-content:space-between;align-items:flex-end}
.eyebrow{display:flex;align-items:center;gap:12px;font:700 21px 'Barlow Condensed';letter-spacing:.2em;
  text-transform:uppercase;color:${C.amber};margin-bottom:3px}
.eyebrow i{display:block;width:44px;height:2px;background:${C.red}}
.eyebrow span{color:#C9D3E4;font-weight:600;font-size:19px;letter-spacing:.16em}
.date{font:900 67px/1 'Playfair Display';color:#fff;letter-spacing:-.5px;white-space:nowrap}
.sum{width:316px;border-left:3px solid ${C.red};padding:2px 0 2px 15px;margin-bottom:6px;
  font:italic 500 19.5px/1.3 'Playfair Display';color:${C.cream}}
.grid{position:absolute;left:12px;right:12px;top:${HERO_H + 12}px;display:grid;
  grid-template-columns:1fr 1fr;gap:10px 10px}
.card{height:186px;background:#fff;border:1px solid #DDD4C2;border-radius:10px;overflow:hidden;display:flex;
  box-shadow:0 1px 0 rgba(15,27,45,.06),0 6px 14px -8px rgba(15,27,45,.28)}
.tile{flex:0 0 122px;height:186px;background:${C.navy2}}
.tile svg{display:block;width:122px;height:186px}
.txt{flex:1;min-width:0;padding:11px 12px 10px 14px;display:flex;flex-direction:column}
.kicker{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.num{flex:0 0 23px;height:23px;border-radius:50%;background:${C.red};color:#fff;
  font:700 16px/23px 'Barlow Condensed';text-align:center}
.place{font:700 15.5px/1 'Barlow Condensed';letter-spacing:.1em;text-transform:uppercase;color:${C.redDark};
  white-space:nowrap}
h2{font:700 30px/1.07 'Barlow Condensed';color:${C.ink};letter-spacing:.005em;text-wrap:balance;margin-bottom:6px}
h2 mark{background:linear-gradient(transparent 58%,#FBD467 58%,#FBD467 94%,transparent 94%);color:inherit;
  padding:0 2px;margin:0 -2px}
p{font:500 16px/1.34 'Inter';color:${C.body};text-wrap:pretty}
.foot{position:absolute;left:14px;right:14px;top:${HERO_H + 12 + 3 * 186 + 2 * 10 + 9}px;height:22px;
  display:flex;justify-content:space-between;align-items:center;
  font:600 15px/1 'Barlow Condensed';letter-spacing:.07em;text-transform:uppercase;color:#4B5567}
.foot b{color:${C.redDark};font-weight:700}
.foot .dot{display:inline-block;width:11px;height:11px;border-radius:50%;background:${C.red};margin-right:7px;
  vertical-align:-1px}
</style></head>
<body>
  <section class="hero">
    ${mapSvg}
    <header class="head">
      <div>
        <div class="eyebrow">Tuesday<i></i><span>The world in six stories</span></div>
        <div class="date">24 November 2026</div>
      </div>
      <div class="sum">A boardroom U-turn, a landmark verdict and flashpoints from Gaza to the Baltic.</div>
    </header>
  </section>
  <main class="grid">${cards}</main>
  <footer class="foot">
    <div><span class="dot"></span>Numbers match the pins on the map</div>
    <div><b>“Says”</b> and <b>“claims”</b> = one side’s account, not established fact</div>
  </footer>
</body></html>`;

fs.writeFileSync('index.html', html);

// ---------- render ----------
// Any Chromium works; CHROMIUM_PATH overrides the Playwright cache location used to make the entry.
const exe = process.env.CHROMIUM_PATH || path.join(os.homedir(),
  '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell');
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve('index.html'));
await page.evaluate(() => document.fonts.ready);

// ---------- self-check ----------
const report = await page.evaluate(() => {
  const out = [];
  const fontsOk = ['900 20px "Playfair Display"', 'italic 500 20px "Playfair Display"',
    '700 20px "Barlow Condensed"', '600 20px "Barlow Condensed"', '500 20px Inter']
    .map((f) => [f, document.fonts.check(f)]);
  out.push('fonts: ' + fontsOk.map(([f, ok]) => (ok ? 'ok' : 'MISSING ' + f)).join(', '));
  document.querySelectorAll('.card').forEach((c, i) => {
    const t = c.querySelector('.txt');
    const h = c.querySelector('h2'), p = c.querySelector('p');
    const hl = Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight));
    const pl = Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight));
    const slack = t.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom;
    const place = c.querySelector('.place');
    const overflowX = place.getBoundingClientRect().right > t.getBoundingClientRect().right - 10;
    out.push(`card ${i + 1}: h2 ${getComputedStyle(h).fontSize} x${hl} lines, p ${getComputedStyle(p).fontSize} x${pl} lines, ` +
      `bottom slack ${slack.toFixed(1)}px${slack < 8 ? '  <-- OVERFLOW RISK' : ''}${overflowX ? '  <-- KICKER TOO WIDE' : ''}`);
  });
  let minPx = 1e9, minEl = '';
  document.querySelectorAll('body *').forEach((el) => {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < minPx) { minPx = fs; minEl = el.textContent.trim().slice(0, 30); }
    const r = el.getBoundingClientRect();
    if (r.left < 0 || r.top < 0 || r.right > 1024 || r.bottom > 1024) out.push('OUT OF CANVAS: ' + el.textContent.trim().slice(0, 40));
  });
  out.push(`smallest text: ${minPx}px ("${minEl}")`);
  const f = document.querySelector('.foot').getBoundingClientRect();
  out.push(`footer: ${f.top.toFixed(0)}..${f.bottom.toFixed(0)} (canvas 1024)`);
  const d = document.querySelector('.date').getBoundingClientRect(), s = document.querySelector('.sum').getBoundingClientRect();
  out.push(`date right ${d.right.toFixed(0)}, summary left ${s.left.toFixed(0)}, summary ${s.top.toFixed(0)}..${s.bottom.toFixed(0)}`);
  return out;
});
console.log(report.join('\n'));
console.log('pins:', stories.map((s) => `${s.n}@${projection([s.lon, s.lat]).map((v) => v.toFixed(0))}`).join('  '));

fs.mkdirSync('out', { recursive: true });
await page.screenshot({ path: 'out/entry.png', clip: { x: 0, y: 0, width: W, height: H }, type: 'png' });
await browser.close();
const buf = fs.readFileSync('out/entry.png');
console.log(`out/entry.png  ${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}  ${(buf.length / 1024).toFixed(0)} KiB`);
