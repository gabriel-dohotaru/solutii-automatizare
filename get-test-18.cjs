const fs = require('fs');

const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));

// Find test #18 (array index 17)
const test18 = data[17];

console.log('=== TEST #18 DETAILS ===\n');
console.log(`Description: ${test18.description}`);
console.log(`Category: ${test18.category}`);
console.log(`Currently passes: ${test18.passes}\n`);
console.log('Steps:');
test18.steps.forEach((step, i) => {
  console.log(`  ${i + 1}. ${step}`);
});
