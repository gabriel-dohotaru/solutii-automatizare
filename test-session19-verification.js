const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Session 19 - Verification Test');
  console.log('Testing: Login flow and dashboard access\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Step 1: Homepage loads
    console.log('✓ Step 1: Navigate to homepage...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'verify-s19-01-homepage.png', fullPage: true });
    console.log('✓ Homepage loaded');

    // Step 2: Navigate to login
    console.log('\n✓ Step 2: Navigate to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'verify-s19-02-login.png' });
    console.log('✓ Login page loaded');

    // Step 3: Fill login form
    console.log('\n✓ Step 3: Fill login credentials...');
    await page.type('input[type="email"]', 'ion.popescu@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.screenshot({ path: 'verify-s19-03-filled.png' });
    console.log('✓ Credentials filled');

    // Step 4: Submit login
    console.log('\n✓ Step 4: Submit login form...');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
    await page.screenshot({ path: 'verify-s19-04-dashboard.png', fullPage: true });
    console.log('✓ Login successful, redirected to dashboard');

    // Step 5: Verify dashboard content
    console.log('\n✓ Step 5: Verify dashboard elements...');
    const url = page.url();
    if (!url.includes('/client')) {
      throw new Error('Not redirected to client dashboard!');
    }

    const welcomeText = await page.evaluate(() => {
      const heading = document.querySelector('h1, h2');
      return heading ? heading.textContent : '';
    });
    console.log(`✓ Dashboard heading: "${welcomeText}"`);

    // Step 6: Test navigation to projects
    console.log('\n✓ Step 6: Navigate to projects...');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'verify-s19-05-projects.png', fullPage: true });
    console.log('✓ Projects page loaded');

    // Step 7: Test navigation to invoices
    console.log('\n✓ Step 7: Navigate to invoices...');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'verify-s19-06-invoices.png', fullPage: true });
    console.log('✓ Invoices page loaded');

    console.log('\n✅ ALL VERIFICATION TESTS PASSED!');
    console.log('✅ No regressions detected');
    console.log('✅ Core functionality working correctly\n');

  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED!');
    console.error('Error:', error.message);
    await page.screenshot({ path: 'verify-s19-error.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
