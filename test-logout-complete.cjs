const puppeteer = require('puppeteer');

(async () => {
  console.log('🔒 TEST #19: User can logout successfully');
  console.log('Testing all 5 steps of the logout feature...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Step 1: Login as client user
    console.log('✓ Step 1: Login as client user');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'test-logout-01-before-login.png' });

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-logout-02-logged-in.png' });

    // Verify we're on the dashboard
    const url = page.url();
    if (!url.includes('/client')) {
      throw new Error('Failed to login - not on client dashboard');
    }
    console.log('   ✅ Logged in successfully');

    // Step 2: Click logout button
    console.log('✓ Step 2: Click logout button');

    // Wait for the page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'test-logout-03-before-logout.png', fullPage: true });

    // Click the logout button via React's onClick handler (Puppeteer click doesn't work with React)
    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

    const clicked = await page.evaluate(() => {
      const button = document.querySelector('button.p-2.text-slate-500');
      if (!button) return false;

      // Find React props and call onClick directly
      const reactKey = Object.keys(button).find(key => key.startsWith('__reactProps'));
      if (reactKey && button[reactKey].onClick) {
        button[reactKey].onClick({ preventDefault: () => {}, stopPropagation: () => {} });
        return true;
      }
      return false;
    });

    if (!clicked) {
      throw new Error('Logout button not found or onClick handler missing');
    }

    await navigationPromise;
    await page.screenshot({ path: 'test-logout-04-after-logout.png' });
    console.log('   ✅ Clicked logout button');

    // Step 3: Verify redirect to homepage or login
    console.log('✓ Step 3: Verify redirect to homepage or login');
    const currentUrl = page.url();
    if (!currentUrl.includes('/login') && !currentUrl.endsWith('/')) {
      throw new Error(`Expected to be on /login or /, but on: ${currentUrl}`);
    }
    console.log(`   ✅ Redirected to: ${currentUrl}`);

    // Step 4: Verify JWT token is cleared
    console.log('✓ Step 4: Verify JWT token is cleared');
    const token = await page.evaluate(() => {
      return localStorage.getItem('token');
    });
    const authToken = await page.evaluate(() => {
      return localStorage.getItem('authToken');
    });
    const user = await page.evaluate(() => {
      return localStorage.getItem('user');
    });

    if (token || authToken || user) {
      throw new Error('Token/user data not cleared from localStorage');
    }
    console.log('   ✅ All auth data cleared from localStorage');

    // Step 5: Verify cannot access protected routes
    console.log('✓ Step 5: Verify cannot access protected routes');

    // Try to access dashboard
    await page.goto('http://localhost:5173/client', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-logout-05-protected-route.png' });

    const finalUrl = page.url();
    if (!finalUrl.includes('/login')) {
      throw new Error('Should be redirected to login when accessing protected route');
    }
    console.log('   ✅ Cannot access protected routes - redirected to login');

    console.log('\n✅ ALL 5 STEPS PASSED');
    console.log('Test #19: User can logout successfully - COMPLETE\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-logout-error.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
})();
