// Simple test for tickets API
import http from 'http';

// First login to get token
const loginData = JSON.stringify({
  email: 'client@test.ro',
  password: 'client123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    const parsed = JSON.parse(responseData);
    if (parsed.success) {
      const token = parsed.data.token;
      console.log('✓ Login successful, got token');

      // Now test fetching tickets
      const ticketsOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/client/tickets',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const ticketsReq = http.request(ticketsOptions, (ticketsRes) => {
        let ticketsData = '';
        ticketsRes.on('data', (chunk) => { ticketsData += chunk; });
        ticketsRes.on('end', () => {
          const ticketsParsed = JSON.parse(ticketsData);
          console.log('\nTickets API response:', JSON.stringify(ticketsParsed, null, 2));

          if (ticketsParsed.success && ticketsParsed.data.length > 0) {
            const firstTicketId = ticketsParsed.data[0].id;
            console.log(`\n✓ Found ${ticketsParsed.data.length} tickets`);
            console.log(`Testing detail API for ticket ID: ${firstTicketId}`);

            // Test ticket detail API
            const detailOptions = {
              hostname: 'localhost',
              port: 3001,
              path: `/api/client/tickets/${firstTicketId}`,
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            };

            const detailReq = http.request(detailOptions, (detailRes) => {
              let detailData = '';
              detailRes.on('data', (chunk) => { detailData += chunk; });
              detailRes.on('end', () => {
                console.log('\nTicket Detail API response:', JSON.stringify(JSON.parse(detailData), null, 2));
              });
            });

            detailReq.on('error', (e) => { console.error('Detail API error:', e.message); });
            detailReq.end();
          }
        });
      });

      ticketsReq.on('error', (e) => { console.error('Tickets API error:', e.message); });
      ticketsReq.end();
    }
  });
});

loginReq.on('error', (e) => { console.error('Login error:', e.message); });
loginReq.write(loginData);
loginReq.end();
