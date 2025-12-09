const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Logout Test with Console Monitoring');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  // Listen to console messages
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}]:`, msg.text());
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]:`, error.message);
  });

  try {
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('✓ Logged in\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Inject logging into the handleLogout function
    await page.evaluate(() => {
      console.log('=== Injecting logout monitoring ===');
      const originalSetItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function(key) {
        console.log(`localStorage.removeItem('${key}')`);
        return originalSetItem.apply(this, arguments);
      };
    });

    console.log('✓ Injected monitoring');

    // Click the button
    const button = await page.$('button.p-2.text-slate-500');
    if (button) {
      console.log('✓ Found button, clicking...\n');
      await button.click();
      await new Promise(resolve => setTimeout(resolve, 3000));

      const url = page.url();
      console.log('\nFinal URL:', url);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
