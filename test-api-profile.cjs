const http = require('http');

// Test if the profile endpoint exists
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/profile',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer invalid-token-for-testing'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', data);

    if (res.statusCode === 404) {
      console.log('\n❌ Endpoint not found - backend needs to be restarted');
      console.log('The route was added but the server hasn\'t picked it up yet.');
    } else if (res.statusCode === 401 || res.statusCode === 403) {
      console.log('\n✅ Endpoint exists! (Auth error is expected with invalid token)');
    } else {
      console.log(`\n⚠️  Unexpected status: ${res.statusCode}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify({ firstName: 'Test' }));
req.end();
