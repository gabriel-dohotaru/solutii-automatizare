// Test quote request API
const testData = {
  projectType: 'ecommerce-module',
  platform: 'prestashop',
  description: 'Test quote request from automated test',
  existingWebsite: 'https://example.com',
  specificRequirements: 'Integration with payment gateway',
  timeline: '1-month',
  budgetRange: '500-1500',
  name: 'Test User',
  email: 'test@example.com',
  phone: '0721234567',
  company: 'Test Company'
};

fetch('http://localhost:3001/api/quote-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
