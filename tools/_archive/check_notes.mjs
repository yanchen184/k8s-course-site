import { readFileSync } from 'fs';
const content = readFileSync('D:/Downloads-Archive/Documents/teacher/k8s-course-site/src/slides/lesson1-afternoon/index.tsx', 'utf8');

// Split by notes: ` to find each notes block
const parts = content.split('notes: `');
const durations = [];
const notes = [];

// Extract durations
const durMatches = [...content.matchAll(/duration: "(\d+)"/g)];
durMatches.forEach(m => durations.push(parseInt(m[1])));

// Extract notes content (between backticks after 'notes: `')
for (let i = 1; i < parts.length; i++) {
  // Find the closing backtick
  const end = parts[i].indexOf('`,');
  if (end !== -1) {
    notes.push(parts[i].substring(0, end));
  }
}

console.log(`Found ${notes.length} notes, ${durations.length} durations`);
let allPass = true;
for (let i = 0; i < notes.length; i++) {
  const chars = notes[i].length;
  const dur = durations[i];
  const required = dur * 150;
  const pass = chars >= required;
  if (!pass) allPass = false;
  console.log(`Slide ${i+1} (dur=${dur}): ${chars}/${required} ${pass ? 'PASS ✓' : 'FAIL ✗ need '+(required-chars)+' more'}`);
}
console.log('');
console.log(allPass ? 'ALL PASS ✓' : 'SOME SLIDES FAILED');
