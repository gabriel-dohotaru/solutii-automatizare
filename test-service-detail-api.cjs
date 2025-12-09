const http = require('http');

console.log('Testing Service Detail API...\n');

// Test 1: Get a specific service by slug
function getServiceBySlug(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3006,
      path: `/api/services/${slug}`,
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
    console.log('Step 1: Make GET request to /api/services/module-prestashop');
    const result = await getServiceBySlug('module-prestashop');

    console.log('Step 2: Verify response status is 200');
    if (result.status === 200) {
      console.log('✅ Status is 200');
    } else {
      console.log(`❌ Status is ${result.status}, expected 200`);
      console.log('Response:', JSON.stringify(result.data, null, 2));
      return;
    }

    console.log('\nStep 3: Verify service details returned');
    if (result.data.success && result.data.service) {
      console.log('✅ Service details returned');
      console.log('Service name:', result.data.service.name);
      console.log('Service slug:', result.data.service.slug);
      console.log('Service category:', result.data.service.category);
    } else {
      console.log('❌ Service details missing');
      console.log('Response:', JSON.stringify(result.data, null, 2));
      return;
    }

    console.log('\nStep 4: Verify features array is included');
    const service = result.data.service;
    if (Array.isArray(service.features) && service.features.length > 0) {
      console.log('✅ Features array is included');
      console.log('Number of features:', service.features.length);
      console.log('Features:', service.features);
    } else {
      console.log('❌ Features array missing or empty');
      console.log('Features:', service.features);
      return;
    }

    console.log('\nStep 5: Verify full description is present');
    if (service.full_description && service.full_description.length > 0) {
      console.log('✅ Full description is present');
      console.log('Description length:', service.full_description.length);
      console.log('Description preview:', service.full_description.substring(0, 100) + '...');
    } else {
      console.log('❌ Full description missing');
      return;
    }

    console.log('\n========================================');
    console.log('✅ ALL TEST STEPS PASSED');
    console.log('========================================');

    console.log('\n=== Full Service Object ===');
    console.log(JSON.stringify(service, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
