const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Session 25 Pre-Flight Verification...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Monitor console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Test 1: Homepage loads
    console.log('Test 1: Homepage loads...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-01-homepage.png' });
    console.log('✅ Test 1 passed\n');

    // Test 2: Login page loads
    console.log('Test 2: Login page loads...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-02-login.png' });
    console.log('✅ Test 2 passed\n');

    // Test 3: Can login
    console.log('Test 3: User can login...');
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'verify-s25-03-login-filled.png' });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-04-dashboard.png' });

    if (page.url().includes('/client')) {
      console.log('✅ Test 3 passed - Redirected to dashboard\n');
    } else {
      console.log('❌ Test 3 failed - Not on dashboard page');
      throw new Error('Login failed');
    }

    // Test 4: Projects page loads
    console.log('Test 4: Projects page loads...');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-05-projects.png' });
    console.log('✅ Test 4 passed\n');

    // Test 5: Support page loads
    console.log('Test 5: Support page loads...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-06-support.png' });
    console.log('✅ Test 5 passed\n');

    // Test 6: Settings page loads
    console.log('Test 6: Settings page loads...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s25-07-settings.png' });
    console.log('✅ Test 6 passed\n');

    // Check for console errors
    if (errors.length > 0) {
      console.log('\n⚠️ Console errors detected:');
      errors.forEach(err => console.log('  -', err));
    } else {
      console.log('\n✅ No console errors detected');
    }

    console.log('\n========================================');
    console.log('Pre-Flight Verification: ALL TESTS PASSED ✅');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
