const fs = require('fs');

const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));

console.log('=== TEST ANALYSIS ===\n');
console.log(`Total tests: ${data.length}`);
console.log(`Passing: ${data.filter(t => t.passes).length}`);
console.log(`Failing: ${data.filter(t => !t.passes).length}\n`);

const failing = data.filter(t => !t.passes);

console.log('First 5 failing tests:\n');
failing.slice(0, 5).forEach((test, i) => {
  const index = data.indexOf(test) + 1;
  console.log(`${i+1}. Test #${index}: ${test.description}`);
  console.log(`   Category: ${test.category}`);
  console.log(`   Steps: ${test.steps.length}`);
  console.log('');
});
