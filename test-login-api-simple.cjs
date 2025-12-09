const http = require('http');

const data = JSON.stringify({
  email: 'client@test.ro',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Response:', body);
    try {
      const json = JSON.parse(body);
      if (json.token) {
        console.log('\n✅ Login API works - token received');
      } else {
        console.log('\n❌ Login API issue - no token in response');
      }
    } catch (e) {
      console.log('\n❌ Login API issue - invalid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
