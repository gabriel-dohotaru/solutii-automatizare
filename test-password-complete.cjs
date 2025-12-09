const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Test #17: Client can change password\n');
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Track API responses
  let passwordChangeResponse = null;
  let loginResponse = null;

  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/password')) {
      passwordChangeResponse = {
        status: response.status(),
        data: await response.json()
      };
    }
    if (response.url().includes('/api/auth/login')) {
      try {
        loginResponse = {
          status: response.status(),
          data: await response.json()
        };
      } catch (e) {}
    }
  });

  try {
    // Step 1: Login as client user
    console.log('Step 1: Login as client user...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    await page.screenshot({ path: 'test-pwd-complete-01-logged-in.png' });
    console.log('✅ Step 1 PASSED: Logged in successfully\n');

    // Step 2: Navigate to /client/setari
    console.log('Step 2: Navigate to /client/setari...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-pwd-complete-02-settings.png' });
    console.log('✅ Step 2 PASSED: Settings page loaded\n');

    // Step 3: Locate password change section
    console.log('Step 3: Locate password change section...');
    const passwordSectionExists = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      return headings.some(h => h.textContent.includes('Schimbă Parola'));
    });

    if (!passwordSectionExists) {
      throw new Error('Password change section not found');
    }
    console.log('✅ Step 3 PASSED: Password section found\n');

    // Step 4: Enter current password
    console.log('Step 4: Enter current password...');
    await page.evaluate(() => {
      const input = document.querySelector('input[name="currentPassword"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'client123');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    console.log('✅ Step 4 PASSED: Current password entered\n');

    // Step 5: Enter new password
    console.log('Step 5: Enter new password...');
    await page.evaluate(() => {
      const input = document.querySelector('input[name="newPassword"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'newpassword123');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    console.log('✅ Step 5 PASSED: New password entered\n');

    // Step 6: Confirm new password
    console.log('Step 6: Confirm new password...');
    await page.evaluate(() => {
      const input = document.querySelector('input[name="confirmPassword"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'newpassword123');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.screenshot({ path: 'test-pwd-complete-03-filled.png' });
    console.log('✅ Step 6 PASSED: Password confirmation entered\n');

    // Step 7: Submit password change
    console.log('Step 7: Submit password change...');
    await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      const passwordForm = forms.find(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        return submitBtn && submitBtn.textContent.includes('Schimbă Parola');
      });

      if (passwordForm) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        passwordForm.dispatchEvent(submitEvent);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for API
    await page.screenshot({ path: 'test-pwd-complete-04-after-submit.png' });
    console.log('✅ Step 7 PASSED: Form submitted\n');

    // Step 8: Verify success message
    console.log('Step 8: Verify success message...');
    const successMessage = await page.evaluate(() => {
      const successDiv = document.querySelector('div[class*="bg-green"]');
      return successDiv ? successDiv.textContent : null;
    });

    if (successMessage && successMessage.includes('Parolă schimbată')) {
      console.log('✅ Step 8 PASSED: Success message displayed');
      console.log('   Message:', successMessage.trim());
    } else {
      throw new Error('Success message not found');
    }

    if (passwordChangeResponse && passwordChangeResponse.status === 200) {
      console.log('✅ API Response: 200 OK\n');
    } else {
      throw new Error('Password change API did not return 200 OK');
    }

    // Step 9: Verify can login with new password
    console.log('Step 9: Verify can login with new password...');

    // Logout
    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-pwd-complete-05-logout.png' });

    // Reset login response
    loginResponse = null;

    // Login with new password
    await page.evaluate(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      const emailInput = document.querySelector('input[type="email"]');
      setter.call(emailInput, 'client@test.ro');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));

      const passwordInput = document.querySelector('input[type="password"]');
      setter.call(passwordInput, 'newpassword123');
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await new Promise(resolve => setTimeout(resolve, 300));
    await page.screenshot({ path: 'test-pwd-complete-06-new-pwd-filled.png' });

    // Submit the login form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

    await page.screenshot({ path: 'test-pwd-complete-07-logged-in-new.png' });

    const currentUrl = page.url();
    if (currentUrl.includes('/client')) {
      console.log('✅ Step 9 PASSED: Successfully logged in with new password!');
      console.log('   Current URL:', currentUrl);
    } else {
      throw new Error('Failed to login with new password');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅✅✅ ALL STEPS PASSED! Test #17 Complete ✅✅✅');
    console.log('='.repeat(60));
    console.log('\nTest Summary:');
    console.log('✅ Step 1: Login with old password');
    console.log('✅ Step 2: Navigate to settings');
    console.log('✅ Step 3: Password section found');
    console.log('✅ Step 4: Enter current password');
    console.log('✅ Step 5: Enter new password');
    console.log('✅ Step 6: Confirm new password');
    console.log('✅ Step 7: Submit form');
    console.log('✅ Step 8: Success message displayed');
    console.log('✅ Step 9: Login with new password');
    console.log('\n⚠️  IMPORTANT: Password changed from "client123" to "newpassword123"');
    console.log('   Run: node reset-test-password.cjs to reset');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-pwd-complete-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
})();
