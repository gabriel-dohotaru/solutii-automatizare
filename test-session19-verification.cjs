const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Session 19 - Verification Test');
  console.log('Testing: Login flow and dashboard access\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
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
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'verify-s19-03-filled.png' });
    console.log('✓ Credentials filled');

    // Step 4: Submit login
    console.log('\n✓ Step 4: Submit login form...');

    // Listen for console logs and errors
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.click('button[type="submit"]');

    // Wait for navigation or error message with longer timeout
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (navError) {
      console.log('⚠️  Navigation timeout - checking if still on login page...');
      await page.screenshot({ path: 'verify-s19-04-after-submit.png' });

      // Check if there's an error message
      const errorMsg = await page.evaluate(() => {
        const error = document.querySelector('.text-red-500, .error, [class*="error"]');
        return error ? error.textContent : null;
      });

      if (errorMsg) {
        throw new Error(`Login failed with error: ${errorMsg}`);
      }

      // Check current URL
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);

      if (currentUrl.includes('/login')) {
        throw new Error('Still on login page after submission - login may have failed');
      }
    }

    await page.screenshot({ path: 'verify-s19-04-dashboard.png', fullPage: true });
    console.log('✓ Login successful, redirected to dashboard');

    // Step 5: Verify dashboard content
    console.log('\n✓ Step 5: Verify dashboard elements...');
    const url = page.url();
    console.log('Current URL:', url);

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
    await browser.close();
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
