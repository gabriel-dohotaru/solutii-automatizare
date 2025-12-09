const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Log console messages
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  // Track API responses
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/password')) {
      console.log('Password API Response Status:', response.status());
      try {
        const data = await response.json();
        console.log('Password API Response Data:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    }
  });

  try {
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);

    console.log('Logged in successfully');

    // Navigate to settings
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    console.log('On settings page');

    // Fill password form
    await page.evaluate(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      const currentPwd = document.querySelector('input[name="currentPassword"]');
      if (currentPwd) {
        setter.call(currentPwd, 'client123');
        currentPwd.dispatchEvent(new Event('input', { bubbles: true }));
        currentPwd.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const newPwd = document.querySelector('input[name="newPassword"]');
      if (newPwd) {
        setter.call(newPwd, 'newpassword123');
        newPwd.dispatchEvent(new Event('input', { bubbles: true }));
        newPwd.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const confirmPwd = document.querySelector('input[name="confirmPassword"]');
      if (confirmPwd) {
        setter.call(confirmPwd, 'newpassword123');
        confirmPwd.dispatchEvent(new Event('input', { bubbles: true }));
        confirmPwd.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    console.log('Filled password form');
    await page.screenshot({ path: 'debug-pwd-before-submit.png' });

    // Click submit button
    const submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      return buttons.find(btn => btn.textContent.includes('Schimbă Parola'));
    });

    if (submitButton) {
      console.log('Found submit button, clicking...');
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait longer
      await page.screenshot({ path: 'debug-pwd-after-submit.png' });
    }

    // Check for messages
    const messages = await page.evaluate(() => {
      const success = Array.from(document.querySelectorAll('div[class*="bg-green"]')).map(el => el.textContent);
      const error = Array.from(document.querySelectorAll('div[class*="bg-red"]')).map(el => el.textContent);
      return { success, error };
    });

    console.log('Messages found:', messages);

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'debug-pwd-error.png' });
  } finally {
    await browser.close();
  }
})();
