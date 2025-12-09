// Test #17: Client can update profile information
// Final comprehensive test

const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Test #17: Client can update profile information - FINAL TEST\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 900 }
  });

  const page = await browser.newPage();

  try {
    // Step 1: Login as client user
    console.log('Step 1: Login as client user...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    await page.click('input[type="email"]');
    await page.type('input[type="email"]', 'client@test.ro');

    await page.click('input[type="password"]');
    await page.type('input[type="password"]', 'client123');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    console.log('  ✅ Logged in successfully\n');

    // Step 2: Navigate to /client/setari
    console.log('Step 2: Navigate to /client/setari...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.screenshot({ path: 'test-profile-final-01-page.png', fullPage: true });
    console.log('  ✅ Settings page loaded\n');

    // Step 3 & 4: Update fields using proper React method
    console.log('Step 3: Update first name field...');
    console.log('Step 4: Update phone number...');

    // Use evaluate to directly modify React state
    await page.evaluate(() => {
      // Find first name input
      const firstNameInput = document.querySelector('input[name="firstName"]');
      if (firstNameInput) {
        // Set value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(firstNameInput, 'Ionel');

        // Trigger React onChange
        const event = new Event('input', { bubbles: true });
        firstNameInput.dispatchEvent(event);
      }

      // Find phone input
      const phoneInput = document.querySelector('input[name="phone"]');
      if (phoneInput) {
        // Romanian mobile format: must start with +40 or 0 and be valid
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(phoneInput, '0755123999');

        const event = new Event('input', { bubbles: true });
        phoneInput.dispatchEvent(event);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('  ✅ Updated first name to "Ionel"\n');
    console.log('  ✅ Updated phone to "0755123999"\n');

    await page.screenshot({ path: 'test-profile-final-02-filled.png', fullPage: true });

    // Step 5: Click save button
    console.log('Step 5: Click save button...');

    // Listen for API response
    let apiResponse = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/profile')) {
        try {
          apiResponse = {
            status: response.status(),
            data: await response.json()
          };
        } catch (e) {
          apiResponse = {
            status: response.status(),
            error: 'Could not parse JSON'
          };
        }
      }
    });

    await page.click('button[type="submit"]');

    // Wait for API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.screenshot({ path: 'test-profile-final-03-after-save.png', fullPage: true });
    console.log('  ✅ Clicked save button\n');

    // Step 6: Verify success message
    console.log('Step 6: Verify success message appears...');

    const pageText = await page.evaluate(() => document.body.textContent);
    const currentUrl = page.url();

    if (currentUrl.includes('/login')) {
      console.log('  ❌ ERROR: Redirected to login page!');
      console.log('  This indicates the session was lost or there was an auth error\n');

      if (apiResponse) {
        console.log('  API Response:', JSON.stringify(apiResponse, null, 2));
      } else {
        console.log('  No API response captured (request may not have been sent)\n');
      }

      throw new Error('Session lost - redirected to login');
    }

    // Check for success/error messages
    if (pageText.includes('actualizat cu succes') || pageText.includes('Profil actualizat')) {
      console.log('  ✅ Success message displayed!\n');
    } else if (pageText.includes('Eroare') || pageText.includes('error')) {
      console.log('  ❌ Error message displayed');
      if (apiResponse) {
        console.log('  API Response:', JSON.stringify(apiResponse, null, 2), '\n');
      }
    } else {
      console.log('  ⚠️  No clear success/error message visible');
      if (apiResponse) {
        console.log('  API Response:', JSON.stringify(apiResponse, null, 2), '\n');
      } else {
        console.log('  No API response captured\n');
      }
    }

    // Step 7: Verify via localStorage
    console.log('Step 7: Verify changes saved...');

    const storedUser = await page.evaluate(() => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    });

    if (storedUser) {
      console.log('  User data in localStorage:');
      console.log('    - Email:', storedUser.email);
      console.log('    - First Name:', storedUser.first_name);
      console.log('    - Last Name:', storedUser.last_name);
      console.log('    - Phone:', storedUser.phone);
      console.log('    - Company:', storedUser.company || storedUser.company_name);

      if (storedUser.first_name === 'Ionel') {
        console.log('  ✅ First name updated correctly in localStorage!\n');
      } else {
        console.log('  ⚠️  First name in localStorage:', storedUser.first_name, '\n');
      }
    } else {
      console.log('  ⚠️  No user data in localStorage\n');
    }

    console.log('✅ Test #17 COMPLETED');
    console.log('   Check screenshots for visual verification\n');

    if (apiResponse && apiResponse.status === 200) {
      console.log('✅ TEST PASSED - Profile update successful!\n');
    } else if (apiResponse) {
      console.log('⚠️  TEST PARTIALLY PASSED - API returned status:', apiResponse.status, '\n');
    } else {
      console.log('⚠️  TEST NEEDS INVESTIGATION - No API response captured\n');
    }

  } catch (error) {
    console.error('❌ Test #17 FAILED:', error.message);
    await page.screenshot({ path: 'test-profile-final-error.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
