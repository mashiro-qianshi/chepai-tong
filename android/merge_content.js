const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // chepai-app/
global.window = {};
require(path.join(root, 'js', 'data.js'));
const PLATES = global.window.PLATES;

const partsDir = path.join(__dirname, 'content_parts');
const files = fs.readdirSync(partsDir).filter(f => f.endsWith('.json'));

const parts = {};
for (const f of files) {
  const abbr = f.replace(/\.json$/, '');
  try {
    parts[abbr] = JSON.parse(fs.readFileSync(path.join(partsDir, f), 'utf8'));
  } catch (e) {
    console.error('BAD JSON', f, e.message);
  }
}

function norm(s) { return String(s).replace(/\([^)]*\)/g, '').trim(); }

let enriched = 0;
const missing = [];
for (const p of PLATES) {
  const part = parts[p.abbr];
  if (!part) { missing.push(p.abbr + '(' + p.name + ') 无内容文件'); continue; }
  const byLetter = {};
  for (const c of part.cities) byLetter[c.l] = c;
  for (const c of p.cities) {
    const e = byLetter[c.l];
    if (!e) continue; // 特殊条目保持原样
    if (norm(e.city) !== norm(c.city)) {
      missing.push(p.abbr + c.l + ' 城市名不一致: ' + c.city + ' vs ' + e.city);
      continue;
    }
    c.h = e.h; c.s = e.s; c.f = e.f; c.tip = e.tip || '';
    if (e.desc) c.desc = e.desc;
    enriched++;
  }
}

fs.writeFileSync(path.join(root, 'js', 'data.js'), 'window.PLATES = ' + JSON.stringify(PLATES, null, 1) + ';\n', 'utf8');
console.log('provinces:', PLATES.length, '| parts:', files.length, '| enriched cities:', enriched);
if (missing.length) console.log('MISSING:\n' + missing.join('\n'));
else console.log('ALL MATCHED');
