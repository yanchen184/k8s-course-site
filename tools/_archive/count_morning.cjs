const fs = require('fs');
const c = fs.readFileSync('src/slides/lesson1-morning/index.tsx', 'utf8');

// Find all notes + duration pairs
const noteMatches = [...c.matchAll(/notes:\s*`([\s\S]*?)`,\s*\n\s*duration:\s*["'](\d+)["']/g)];

let total = 0;
noteMatches.forEach((m, i) => {
  const notes = m[1];
  const duration = parseInt(m[2]);
  const cc = notes.length;
  total += cc;
  const target = duration * 200;
  const status = cc >= target ? 'OK' : 'LOW';
  console.log(`Slide ${i+1} [${status}] dur:${duration} chars:${cc} target:${target} deficit:${target-cc}`);
});

console.log('\nTOTAL:', total, 'TARGET: 35910 DEFICIT:', 35910 - total);
