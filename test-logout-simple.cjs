const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Simple Logout Test');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('✓ Logged in');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Click the logout button
    const button = await page.$('button.p-2.text-slate-500');
    if (button) {
      console.log('✓ Found logout button');

      // Set up listener for navigation BEFORE clicking
      const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => {
        console.log('Navigation promise rejected:', e.message);
        return null;
      });

      await button.click();
      console.log('✓ Clicked button');

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);

      // Check localStorage
      const hasToken = await page.evaluate(() => {
        return {
          token: localStorage.getItem('token'),
          authToken: localStorage.getItem('authToken'),
          user: localStorage.getItem('user')
        };
      });
      console.log('LocalStorage:', hasToken);

    } else {
      console.log('❌ Button not found');
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
