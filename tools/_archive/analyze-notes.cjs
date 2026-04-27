const fs = require('fs');
const content = fs.readFileSync('src/slides/lesson3-morning/index.tsx', 'utf8');

const notesRegex = /notes:\s*`([\s\S]*?)`,/g;
const durationRegex = /duration:\s*"(\d+)"/g;
let notesMatches = [];
let durationMatches = [];
let m;

while ((m = notesRegex.exec(content)) !== null) {
  notesMatches.push(m[1]);
}
while ((m = durationRegex.exec(content)) !== null) {
  durationMatches.push(parseInt(m[1]));
}

notesMatches.forEach((notes, i) => {
  const dur = durationMatches[i] || 0;
  const target = dur * 150;
  const threshold = Math.round(target * 0.9);
  const len = notes.replace(/\s+/g, '').length;
  const status = len >= threshold ? 'OK' : 'NEED';
  console.log('Slide ' + (i+1) + ': dur=' + dur + ' target=' + target + ' thr=' + threshold + ' actual=' + len + ' ' + status + ' gap=' + (len - threshold));
});
