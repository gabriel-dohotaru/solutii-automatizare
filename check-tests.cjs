const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./feature_list.json', 'utf8'));

console.log('Test Status Summary:\n');
data.forEach((t, i) => {
  const status = t.passes ? '✅' : '❌';
  console.log(`Test ${i+1}: ${status} - ${t.description}`);
});

const passing = data.filter(t => t.passes).length;
const total = data.length;
console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${passing}/${total} tests passing (${Math.round(passing/total*100)}%)`);
console.log(`Remaining: ${total - passing} tests`);
