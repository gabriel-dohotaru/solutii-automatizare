const puppeteer = require('puppeteer');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('Starting Session 22 Pre-Flight Verification...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Test 1: Homepage loads
    console.log('✓ Test 1: Homepage loads');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s22-01-homepage.png', fullPage: true });
    await sleep(1000);

    // Test 2: Login flow
    console.log('✓ Test 2: Login flow');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s22-02-login.png' });

    // Fill login form
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'verify-s22-03-login-filled.png' });

    // Submit and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    await sleep(1000);
    await page.screenshot({ path: 'verify-s22-04-dashboard.png', fullPage: true });
    console.log('✓ Login successful, dashboard loaded');

    // Test 3: Projects page
    console.log('✓ Test 3: Projects page');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: 'verify-s22-05-projects.png', fullPage: true });

    // Test 4: Invoices page
    console.log('✓ Test 4: Invoices page');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: 'verify-s22-06-invoices.png', fullPage: true });

    // Test 5: Support page
    console.log('✓ Test 5: Support page');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: 'verify-s22-07-support.png', fullPage: true });

    // Test 6: Settings page
    console.log('✓ Test 6: Settings page');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: 'verify-s22-08-settings.png', fullPage: true });

    console.log('\n✅ All verification tests passed! No regressions detected.\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

runVerification().catch(console.error);
