const fs = require('fs');

const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));

// Test #18 is at index 17
console.log('Updating Test #18 in feature_list.json...\n');
console.log('Before:', data[17].description, '- passes:', data[17].passes);

data[17].passes = true;

console.log('After:', data[17].description, '- passes:', data[17].passes);

fs.writeFileSync('feature_list.json', JSON.stringify(data, null, 2));

console.log('\n✅ feature_list.json updated successfully');
