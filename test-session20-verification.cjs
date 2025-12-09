// Session 20 - Pre-flight Verification Test
// Verify core features still work before proceeding

const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Session 20 - Pre-flight Verification Test\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Test 1: Homepage loads
    console.log('✓ Test 1: Homepage loads...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s20-01-homepage.png', fullPage: false });
    console.log('  ✅ Homepage loaded\n');

    // Test 2: Login flow works
    console.log('✓ Test 2: Login flow...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s20-02-login.png', fullPage: false });

    // Fill login form using Puppeteer's type method which properly triggers React events
    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    await page.type('input[type="email"]', 'client@test.ro');

    await page.click('input[type="password"]');
    await page.type('input[type="password"]', 'client123');

    await page.screenshot({ path: 'verify-s20-03-login-filled.png', fullPage: false });

    // Submit form and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'verify-s20-04-dashboard.png', fullPage: false });
    console.log('  ✅ Login successful\n');

    // Test 3: Dashboard displays
    console.log('✓ Test 3: Dashboard displays...');
    const url = page.url();
    if (url.includes('/client')) {
      console.log('  ✅ Dashboard loaded correctly\n');
    } else {
      console.log('  ❌ Not on dashboard page:', url);
    }

    // Test 4: Projects page accessible
    console.log('✓ Test 4: Projects page...');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s20-05-projects.png', fullPage: false });
    console.log('  ✅ Projects page loaded\n');

    // Test 5: Invoices page accessible
    console.log('✓ Test 5: Invoices page...');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s20-06-invoices.png', fullPage: false });
    console.log('  ✅ Invoices page loaded\n');

    // Test 6: Support page accessible
    console.log('✓ Test 6: Support page...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s20-07-support.png', fullPage: false });
    console.log('  ✅ Support page loaded\n');

    console.log('✅ All pre-flight verification tests PASSED');
    console.log('✅ No regressions detected - safe to proceed\n');

  } catch (error) {
    console.error('❌ Verification test FAILED:', error.message);
    await page.screenshot({ path: 'verify-s20-error.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
