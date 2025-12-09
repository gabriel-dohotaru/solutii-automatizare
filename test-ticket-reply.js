const http = require('http');

// Step 1: Login
function login() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: 'client@test.ro',
      password: 'client123'
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
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success && parsed.data.token) {
            console.log('✅ Step 1: Login successful');
            resolve(parsed.data.token);
          } else {
            reject('Login failed');
          }
        } catch (e) {
          reject('Invalid JSON response');
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Step 2: Create a support ticket
function createTicket(token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      subject: 'Test Ticket for Reply Testing',
      project_id: 1,
      priority: 'medium',
      message: 'This is a test ticket to verify reply functionality works correctly.'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/client/tickets',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success && parsed.data) {
            console.log('✅ Step 2: Support ticket created with ID:', parsed.data.id);
            resolve(parsed.data.id);
          } else {
            reject('Ticket creation failed: ' + parsed.message);
          }
        } catch (e) {
          reject('Invalid JSON response');
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Step 3: Get ticket details
function getTicketDetails(token, ticketId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/client/tickets/${ticketId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success) {
            console.log('✅ Step 3: Ticket details retrieved');
            console.log('   - Subject:', parsed.data.subject);
            console.log('   - Status:', parsed.data.status);
            console.log('   - Initial messages:', parsed.data.messages.length);
            resolve(parsed.data.messages.length);
          } else {
            reject('Get ticket details failed: ' + parsed.message);
          }
        } catch (e) {
          console.error('   - Parse error in getTicketDetails:', e.message);
          console.error('   - Response data:', responseData);
          reject('Invalid JSON response in getTicketDetails: ' + e.message);
        }
      });
    });

    req.on('error', (err) => {
      console.error('   - Request error in getTicketDetails:', err.message);
      reject(err);
    });
    req.end();
  });
}

// Step 4: Reply to ticket
function replyToTicket(token, ticketId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      message: 'This is a test reply to verify the reply functionality is working correctly. The feature should add this message to the ticket thread.'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/client/tickets/${ticketId}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log('   - Response status:', res.statusCode);
        console.log('   - Response data:', responseData);
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success && parsed.data) {
            console.log('✅ Step 4: Reply posted successfully');
            console.log('   - Message ID:', parsed.data.id);
            console.log('   - Author:', parsed.data.first_name, parsed.data.last_name);
            resolve(parsed.data);
          } else {
            reject('Reply failed: ' + parsed.message);
          }
        } catch (e) {
          reject('Invalid JSON response: ' + e.message + ' - Raw: ' + responseData);
        }
      });
    });

    req.on('error', (err) => {
      console.error('   - Request error in replyToTicket:', err.message);
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

// Step 5: Verify reply appears in message thread
function verifyReply(token, ticketId, initialMessageCount) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/client/tickets/${ticketId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success) {
            const newMessageCount = parsed.data.messages.length;
            console.log('✅ Step 5: Verified message thread');
            console.log('   - Previous message count:', initialMessageCount);
            console.log('   - Current message count:', newMessageCount);

            if (newMessageCount > initialMessageCount) {
              console.log('✅ Step 6: Reply successfully added to thread!');
              console.log('\n🎉 ALL TESTS PASSED! Support ticket reply functionality is working correctly.');
              resolve(true);
            } else {
              reject('Reply not found in message thread');
            }
          } else {
            reject('Verification failed: ' + parsed.message);
          }
        } catch (e) {
          console.error('   - Parse error in verifyReply:', e.message);
          console.error('   - Response data:', responseData);
          reject('Invalid JSON response in verifyReply: ' + e.message);
        }
      });
    });

    req.on('error', (err) => {
      console.error('   - Request error in verifyReply:', err.message);
      reject(err);
    });
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('\n========================================');
    console.log('Testing Support Ticket Reply Feature');
    console.log('========================================\n');

    const token = await login();
    const ticketId = await createTicket(token);
    const initialMessageCount = await getTicketDetails(token, ticketId);

    console.log('\nPreparing to reply to ticket...');
    await replyToTicket(token, ticketId);

    console.log('\nVerifying reply was added...');
    await verifyReply(token, ticketId, initialMessageCount);

    console.log('\n========================================');
    console.log('✅ Feature Test #13 - PASSED');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    console.error('Error stack:', error.stack || error);
    process.exit(1);
  }
}

runTests();
