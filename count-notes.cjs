const fs = require('fs');
const content = fs.readFileSync('src/slides/lesson5-morning/index.tsx', 'utf8');
// Simple extraction: find all notes: ` ... ` blocks
const lines = content.split('\n');
let inNotes = false;
let noteText = '';
let slideNum = 0;
let durNum = 0;
let total = 0;
const durations = [];
const noteChars = [];

// Extract durations
const durMatches = content.match(/duration: '(\d+)'/g) || [];
durMatches.forEach(m => durations.push(parseInt(m.match(/\d+/)[0])));

// Extract notes by finding notes: ` and matching closing `
let i = 0;
while (i < content.length) {
  const notesStart = content.indexOf("notes: `", i);
  if (notesStart === -1) break;
  const textStart = notesStart + 8;
  let depth = 1;
  let j = textStart;
  while (j < content.length) {
    if (content[j] === '`') {
      // end of template literal
      break;
    }
    j++;
  }
  const noteContent = content.substring(textStart, j);
  noteChars.push(noteContent.length);
  total += noteContent.length;
  i = j + 1;
}

noteChars.forEach((chars, idx) => {
  const dur = durations[idx] || 0;
  const target = dur * 200;
  const status = chars >= target ? 'OK' : 'NEED +' + (target - chars);
  console.log('Slide ' + (idx+1) + ': chars=' + chars + ', dur=' + dur + 'min, target=' + target + ', ' + status);
});
console.log('TOTAL notes chars:', total);
console.log('TARGET:', 35910);
console.log('NEED:', 35910 - total);
