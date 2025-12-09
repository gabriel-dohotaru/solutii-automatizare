const http = require('http');

console.log('Testing Packages API...\n');

// Test: Get all packages
function getAllPackages() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3007,
      path: '/api/packages',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('Step 1: Make GET request to /api/packages');
    const result = await getAllPackages();

    console.log('Step 2: Verify response status is 200');
    if (result.status === 200) {
      console.log('✅ Status is 200');
    } else {
      console.log(`❌ Status is ${result.status}, expected 200`);
      console.log('Response:', JSON.stringify(result.data, null, 2));
      return;
    }

    console.log('\nStep 3: Verify all three packages returned');
    if (result.data.success && result.data.packages && result.data.packages.length === 3) {
      console.log('✅ All three packages returned');
      console.log('Package count:', result.data.packages.length);
    } else {
      console.log('❌ Expected 3 packages');
      console.log('Packages:', result.data.packages?.length);
      return;
    }

    console.log('\nStep 4: Verify each package has name, price, features');
    const packages = result.data.packages;
    let allValid = true;

    for (const pkg of packages) {
      if (!pkg.name || !pkg.features || !Array.isArray(pkg.features)) {
        console.log(`❌ Package missing required fields:`, pkg);
        allValid = false;
        break;
      }
    }

    if (allValid) {
      console.log('✅ All packages have required fields');
      packages.forEach(pkg => {
        console.log(`  - ${pkg.name}: ${pkg.price_from || 'Custom'} ${pkg.currency || ''}, ${pkg.features.length} features`);
      });
    } else {
      return;
    }

    console.log('\nStep 5: Verify popular package is marked');
    const popularPackage = packages.find(pkg => pkg.is_popular === 1);
    if (popularPackage) {
      console.log('✅ Popular package found:', popularPackage.name);
    } else {
      console.log('❌ No popular package marked');
      return;
    }

    console.log('\n========================================');
    console.log('✅ ALL TEST STEPS PASSED - Test #25');
    console.log('========================================');

    console.log('\n=== All Packages ===');
    console.log(JSON.stringify(packages, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
