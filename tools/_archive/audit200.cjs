const fs = require('fs');
const content = fs.readFileSync(
  'D:/Downloads-Archive/Documents/teacher/k8s-course-site/src/slides/lesson7-morning/index.tsx',
  'utf8'
);

function findNotesBlocks(text) {
  const blocks = [];
  let pos = 0;
  const marker = 'notes: `';
  while (true) {
    const idx = text.indexOf(marker, pos);
    if (idx === -1) break;
    const start = idx + marker.length;
    let end = start;
    while (end < text.length) {
      if (text[end] === '\\' && end + 1 < text.length) { end += 2; }
      else if (text[end] === '`') { break; }
      else { end++; }
    }
    blocks.push({ start, end, len: end - start });
    pos = end + 1;
  }
  return blocks;
}
function findDurArr(text) {
  const res = [];
  const re = /duration:\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) res.push(parseInt(m[1]));
  return res;
}
function findSections(text) {
  const res = [];
  const re = /section:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) res.push(m[1]);
  return res;
}
function findTitles(text) {
  // Only the slide-level title (not jsx text)
  const res = [];
  const re = /^\s{2}title:\s*"([^"]+)"/mg;
  let m;
  while ((m = re.exec(text)) !== null) res.push(m[1]);
  return res;
}

const blocks = findNotesBlocks(content);
const durs = findDurArr(content);
const secs = findSections(content);
const titles = findTitles(content);

const sectionTotals = {};
console.log('=== Per-slide (standard: notes >= duration * 200) ===');
for (let i = 0; i < durs.length; i++) {
  const dur = durs[i];
  const len = blocks[i] ? blocks[i].len : 0;
  const need = dur * 200;
  const gap = need - len;
  const ok = len >= need;
  const sec = secs[i] || '?';
  const title = titles[i] || `slide${i+1}`;
  if (!sectionTotals[sec]) sectionTotals[sec] = { dur: 0, slides: 0, ok: 0, fail: 0 };
  sectionTotals[sec].dur += dur;
  sectionTotals[sec].slides++;
  if (ok) sectionTotals[sec].ok++; else sectionTotals[sec].fail++;
  console.log(`Slide ${String(i+1).padStart(2)} [${sec}] dur=${dur} notes=${len} need=${need} gap=${gap} ${ok ? '✓' : '✗ NEED+'+gap}`);
  console.log(`       "${title}"`);
}

console.log('\n=== Section totals ===');
for (const [sec, v] of Object.entries(sectionTotals)) {
  console.log(`${sec}: ${v.dur}min, ${v.slides} slides, ${v.fail} need expansion`);
}
