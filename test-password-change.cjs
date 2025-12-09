const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting Test #17: Client can change password\n');
  console.log('=' .repeat(60));

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
      try {
        passwordChangeResponse = {
          status: response.status(),
          data: await response.json()
        };
        console.log('Password change API response:', passwordChangeResponse);
      } catch (e) {
        // Ignore JSON parse errors
      }
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

    await page.screenshot({ path: 'test-pwd-01-logged-in.png' });
    console.log('✅ Step 1 PASSED: Logged in successfully\n');

    // Step 2: Navigate to /client/setari
    console.log('Step 2: Navigate to /client/setari...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-pwd-02-settings-page.png' });
    console.log('✅ Step 2 PASSED: Settings page loaded\n');

    // Step 3: Click 'Change password' section (scroll to it)
    console.log('Step 3: Scroll to password change section...');
    await page.evaluate(() => {
      const passwordSection = document.querySelector('form[class*="space-y-6"]');
      if (passwordSection && passwordSection.parentElement.textContent.includes('Schimbă Parola')) {
        passwordSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.screenshot({ path: 'test-pwd-03-scrolled-to-password.png' });
    console.log('✅ Step 3 PASSED: Password section visible\n');

    // Step 4: Enter current password
    console.log('Step 4: Enter current password...');

    // Use proper React event triggering for controlled inputs
    await page.evaluate(() => {
      const input = document.querySelector('input[name="currentPassword"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(input, 'client123');

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('✅ Step 4 PASSED: Current password entered\n');

    // Step 5: Enter new password
    console.log('Step 5: Enter new password...');

    await page.evaluate(() => {
      const input = document.querySelector('input[name="newPassword"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(input, 'newpassword123');

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('✅ Step 5 PASSED: New password entered\n');

    // Step 6: Confirm new password
    console.log('Step 6: Confirm new password...');

    await page.evaluate(() => {
      const input = document.querySelector('input[name="confirmPassword"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(input, 'newpassword123');

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 200));
    await page.screenshot({ path: 'test-pwd-04-before-submit.png' });
    console.log('✅ Step 6 PASSED: Password confirmation entered\n');

    // Step 7: Submit password change
    console.log('Step 7: Submit password change...');

    // Find and click the password change submit button
    const submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      return buttons.find(btn => btn.textContent.includes('Schimbă Parola'));
    });

    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for API response

      await page.screenshot({ path: 'test-pwd-05-after-submit.png' });
      console.log('✅ Step 7 PASSED: Form submitted\n');
    } else {
      throw new Error('Password change submit button not found');
    }

    // Step 8: Verify success message
    console.log('Step 8: Verify success message...');

    await new Promise(resolve => setTimeout(resolve, 500));

    const successMessage = await page.evaluate(() => {
      const messages = Array.from(document.querySelectorAll('div[class*="bg-green"]'));
      return messages.find(msg => msg.textContent.includes('Parolă schimbată'))?.textContent || null;
    });

    if (successMessage) {
      console.log('✅ Step 8 PASSED: Success message displayed:', successMessage.trim());
    } else {
      throw new Error('Success message not found');
    }

    // Verify API response
    if (passwordChangeResponse && passwordChangeResponse.status === 200) {
      console.log('✅ API Response: 200 OK');
    } else {
      throw new Error('Password change API did not return 200 OK');
    }

    await page.screenshot({ path: 'test-pwd-06-success-message.png' });
    console.log('');

    // Step 9: Verify can login with new password
    console.log('Step 9: Verify can login with new password...');

    // Logout first
    const logoutButton = await page.$('button svg[class*="lucide-log-out"]');
    if (logoutButton) {
      await logoutButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Navigate to login page
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-pwd-07-logout-login.png' });

    // Try logging in with new password
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');

      if (emailInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(emailInput, 'client@test.ro');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (passwordInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(passwordInput, 'newpassword123');
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await new Promise(resolve => setTimeout(resolve, 300));
    await page.screenshot({ path: 'test-pwd-08-new-password-filled.png' });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }),
      page.click('button[type="submit"]')
    ]);

    await page.screenshot({ path: 'test-pwd-09-logged-in-new-password.png' });

    // Verify we're on the dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/client')) {
      console.log('✅ Step 9 PASSED: Successfully logged in with new password!');
      console.log('   Current URL:', currentUrl);
    } else {
      throw new Error('Failed to login with new password - not redirected to dashboard');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL STEPS PASSED! Test #17 Complete');
    console.log('='.repeat(60));
    console.log('\nTest Summary:');
    console.log('✅ Step 1: Login with old password - PASSED');
    console.log('✅ Step 2: Navigate to settings - PASSED');
    console.log('✅ Step 3: Password section visible - PASSED');
    console.log('✅ Step 4: Enter current password - PASSED');
    console.log('✅ Step 5: Enter new password - PASSED');
    console.log('✅ Step 6: Confirm new password - PASSED');
    console.log('✅ Step 7: Submit form - PASSED');
    console.log('✅ Step 8: Success message displayed - PASSED');
    console.log('✅ Step 9: Login with new password - PASSED');
    console.log('\n⚠️  IMPORTANT: Password has been changed from "client123" to "newpassword123"');
    console.log('   To reset it back, run: node reset-test-password.cjs');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-pwd-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
})();
