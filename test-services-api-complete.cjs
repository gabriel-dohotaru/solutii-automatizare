const http = require('http');

console.log('Testing Services API (Test #22)...\n');

const options = {
  hostname: 'localhost',
  port: 3006,
  path: '/api/services',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      // Step 1: Make GET request to /api/services
      console.log('Step 1: Make GET request to /api/services');
      console.log('✅ Step 1 passed\n');

      // Step 2: Verify response status is 200
      console.log('Step 2: Verify response status is 200');
      if (res.statusCode !== 200) {
        throw new Error(`Expected status 200, got ${res.statusCode}`);
      }
      console.log(`  Status: ${res.statusCode}`);
      console.log('✅ Step 2 passed\n');

      // Parse JSON
      const json = JSON.parse(body);

      // Step 3: Verify response contains array of services
      console.log('Step 3: Verify response contains array of services');
      if (!json.success) {
        throw new Error('Response success is false');
      }
      if (!Array.isArray(json.services)) {
        throw new Error('Services is not an array');
      }
      console.log(`  Found ${json.services.length} services`);
      console.log('✅ Step 3 passed\n');

      // Step 4: Verify each service has required fields
      console.log('Step 4: Verify each service has required fields (name, category, description)');
      let allFieldsPresent = true;
      json.services.forEach((service, index) => {
        const hasName = service.name && typeof service.name === 'string';
        const hasCategory = service.category && typeof service.category === 'string';
        const hasDescription = (service.short_description || service.full_description);

        if (!hasName || !hasCategory || !hasDescription) {
          console.log(`  ❌ Service ${index + 1} missing required fields`);
          allFieldsPresent = false;
        } else {
          console.log(`  ✓ Service ${index + 1}: ${service.name} (${service.category})`);
        }
      });

      if (!allFieldsPresent) {
        throw new Error('Not all services have required fields');
      }
      console.log('✅ Step 4 passed\n');

      // Step 5: Verify services are ordered by order_index
      console.log('Step 5: Verify services are ordered by order_index');
      let properlyOrdered = true;
      for (let i = 1; i < json.services.length; i++) {
        const prev = json.services[i - 1].order_index || 0;
        const curr = json.services[i].order_index || 0;
        if (prev > curr) {
          console.log(`  ❌ Services not properly ordered at index ${i}`);
          properlyOrdered = false;
          break;
        }
      }

      if (!properlyOrdered) {
        throw new Error('Services not ordered by order_index');
      }
      console.log('  Services properly ordered by order_index');
      console.log('✅ Step 5 passed\n');

      console.log('========================================');
      console.log('Test #22: ALL STEPS PASSED ✅');
      console.log('========================================');
      console.log('\nServices API verification:');
      console.log(`  ✅ Response status: 200`);
      console.log(`  ✅ Services count: ${json.services.length}`);
      console.log(`  ✅ All required fields present`);
      console.log(`  ✅ Properly ordered by order_index`);
      console.log('\n');

    } catch (e) {
      console.error('\n❌ Test failed:', e.message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure backend server is running on port 3006');
  process.exit(1);
});

req.end();
