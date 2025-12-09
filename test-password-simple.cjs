const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Track API responses
  let passwordChangeResponse = null;
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/password')) {
      console.log('✅ Password API called! Status:', response.status());
      try {
        passwordChangeResponse = await response.json();
        console.log('   Response:', JSON.stringify(passwordChangeResponse, null, 2));
      } catch (e) {
        // Ignore
      }
    }
  });

  try {
    // Login
    console.log('Step 1: Logging in...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    console.log('✅ Logged in\n');

    // Navigate to settings
    console.log('Step 2: Navigate to settings...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'simple-pwd-01-settings.png' });
    console.log('✅ On settings page\n');

    // Fill and submit password form
    console.log('Step 3: Fill password form and submit...');
    const result = await page.evaluate(async () => {
      // Fill the form
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      const currentPwd = document.querySelector('input[name="currentPassword"]');
      setter.call(currentPwd, 'client123');
      currentPwd.dispatchEvent(new Event('input', { bubbles: true }));

      const newPwd = document.querySelector('input[name="newPassword"]');
      setter.call(newPwd, 'newpassword123');
      newPwd.dispatchEvent(new Event('input', { bubbles: true }));

      const confirmPwd = document.querySelector('input[name="confirmPassword"]');
      setter.call(confirmPwd, 'newpassword123');
      confirmPwd.dispatchEvent(new Event('input', { bubbles: true }));

      // Find and submit the password form
      const forms = Array.from(document.querySelectorAll('form'));
      const passwordForm = forms.find(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        return submitBtn && submitBtn.textContent.includes('Schimbă Parola');
      });

      if (passwordForm) {
        // Trigger the form submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        passwordForm.dispatchEvent(submitEvent);
        return 'Form submitted';
      }

      return 'Form not found';
    });

    console.log('   Result:', result);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for API

    await page.screenshot({ path: 'simple-pwd-02-after-submit.png' });

    // Check for success message
    const message = await page.evaluate(() => {
      const successDiv = document.querySelector('div[class*="bg-green"]');
      const errorDiv = document.querySelector('div[class*="bg-red"]');

      if (successDiv) {
        return { type: 'success', text: successDiv.textContent };
      }
      if (errorDiv) {
        return { type: 'error', text: errorDiv.textContent };
      }
      return null;
    });

    console.log('\nMessage on page:', message);

    if (passwordChangeResponse) {
      console.log('\n✅ Password change successful!');
      console.log('API Response:', passwordChangeResponse);
    } else {
      console.log('\n⚠️  No API response received - form may not have submitted');
    }

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'simple-pwd-error.png' });
  } finally {
    await browser.close();
  }
})();
