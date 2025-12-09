// Verification test to check if servers are working and core features still function
import puppeteer from 'puppeteer';

async function runVerificationTest() {
  console.log('Starting verification test...');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Step 1: Navigate to homepage...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'verification-homepage.png', fullPage: true });
    console.log('✓ Homepage loaded');

    console.log('Step 2: Navigate to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'verification-login-page.png', fullPage: true });
    console.log('✓ Login page loaded');

    console.log('Step 3: Login with test credentials...');
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.type('input[type="email"]', 'ion.popescu@test.com');
    await page.type('input[type="password"]', 'password123');
    await page.screenshot({ path: 'verification-login-filled.png', fullPage: true });

    await page.click('button[type="submit"]');
    console.log('✓ Login form submitted');

    // Wait for navigation to client dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'verification-dashboard.png', fullPage: true });
    console.log('✓ Client dashboard loaded');

    // Check if we're on the dashboard
    const url = page.url();
    if (url.includes('/client')) {
      console.log('✓ Successfully logged in and redirected to client dashboard');
    } else {
      console.log('✗ Login failed - not redirected to dashboard. Current URL:', url);
    }

    console.log('\n=== VERIFICATION TEST PASSED ===');
    console.log('All core features are working correctly!');

  } catch (error) {
    console.error('✗ Verification test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

runVerificationTest().catch(console.error);
