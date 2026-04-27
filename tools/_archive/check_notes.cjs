const fs = require('fs');
const content = fs.readFileSync('D:\\Downloads-Archive\\Documents\\teacher\\k8s-course-site\\src\\slides\\lesson2-morning\\index.tsx', 'utf8');

// Extract notes sections using backtick markers
const notesSections = [];
let pos = 0;
const startMarker = 'notes: `';
while (true) {
  const startIdx = content.indexOf(startMarker, pos);
  if (startIdx === -1) break;
  const contentStart = startIdx + startMarker.length;
  const endIdx = content.indexOf('`,', contentStart);
  if (endIdx === -1) break;
  notesSections.push(content.slice(contentStart, endIdx).trim());
  pos = endIdx + 2;
}

// Extract durations
const durationSections = [];
let pos2 = 0;
const marker = 'duration: "';
while (true) {
  const idx = content.indexOf(marker, pos2);
  if (idx === -1) break;
  const start = idx + marker.length;
  const end = content.indexOf('"', start);
  durationSections.push(parseInt(content.slice(start, end)));
  pos2 = end + 1;
}

console.log('Slides count:', notesSections.length, 'Durations count:', durationSections.length);
let allPass = true;
notesSections.forEach((n, i) => {
  const len = n.length;
  const dur = durationSections[i] || 0;
  const target = dur * 150;
  const pass = len >= target ? 'PASS' : 'FAIL';
  if (pass === 'FAIL') allPass = false;
  console.log('Slide ' + (i+1) + ': dur=' + dur + ', len=' + len + ', target=' + target + ', ' + pass + (pass === 'FAIL' ? ' (need ' + (target - len) + ' more)' : ''));
});
console.log('All pass:', allPass);
