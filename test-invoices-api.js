// Test the invoices API endpoint
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3005/api';

// First login to get JWT token
async function login() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'ion@client.ro',
      password: 'password123'
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Login successful');
    return data.token;
  } else {
    console.error('Login failed:', data.message);
    return null;
  }
}

// Test invoices endpoint
async function testInvoices() {
  const token = await login();
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE}/client/invoices`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Invoices API Response:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Count:', data.count);
    console.log('Data:', JSON.stringify(data.data, null, 2));
  } catch (error) {
    console.error('Error testing invoices API:', error);
  }
}

testInvoices();