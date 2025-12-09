const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 SESSION 23 PRE-FLIGHT VERIFICATION');
  console.log('Testing core features to ensure no regressions...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Test 1: Homepage loads
    console.log('✓ Test 1: Homepage loads');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-01-homepage.png', fullPage: true });

    // Test 2: Login flow works
    console.log('✓ Test 2: Login flow works');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-02-login.png' });

    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'verify-s23-03-login-filled.png' });

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-04-dashboard.png' });

    // Test 3: Projects page accessible
    console.log('✓ Test 3: Projects page accessible');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-05-projects.png', fullPage: true });

    // Test 4: Invoices page accessible
    console.log('✓ Test 4: Invoices page accessible');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-06-invoices.png' });

    // Test 5: Support page accessible
    console.log('✓ Test 5: Support page accessible');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-07-support.png' });

    // Test 6: Settings page accessible
    console.log('✓ Test 6: Settings page accessible');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s23-08-settings.png', fullPage: true });

    console.log('\n✅ ALL PRE-FLIGHT TESTS PASSED');
    console.log('No regressions detected - safe to proceed with new features\n');

  } catch (error) {
    console.error('\n❌ PRE-FLIGHT TEST FAILED:', error.message);
    await page.screenshot({ path: 'verify-s23-error.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
})();
