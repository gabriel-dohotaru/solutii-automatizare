const http = require('http');

// Test login with existing user (client@test.ro from init-db)
const data = JSON.stringify({
  email: 'client@test.ro',
  password: 'client123'
});

const options = {
  hostname: 'localhost',
  port: 3007,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);

    // Parse and verify response
    try {
      const parsed = JSON.parse(responseData);
      if (parsed.success && parsed.data.token) {
        console.log('✅ Login successful!');
        console.log('✅ Token received');
        console.log('✅ User data:', JSON.stringify(parsed.data.user, null, 2));
      } else {
        console.log('❌ Login failed');
      }
    } catch (e) {
      console.log('❌ Invalid JSON response');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();