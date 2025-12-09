const http = require('http');

console.log('Testing Services API...\n');

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
  console.log(`Status: ${res.statusCode}`);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('\nResponse:');
      console.log(JSON.stringify(json, null, 2));

      if (json.success && json.services) {
        console.log(`\n✅ Services API works - ${json.services.length} services returned`);

        // Display service names
        console.log('\nServices found:');
        json.services.forEach((service, index) => {
          console.log(`  ${index + 1}. ${service.name} (${service.category})`);
        });
      } else {
        console.log('\n❌ Services API issue - no services in response');
      }
    } catch (e) {
      console.log('\n❌ Services API issue - invalid JSON');
      console.log('Body:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure backend server is running on port 3005');
});

req.end();
