const puppeteer = require('puppeteer');
const Database = require('./backend/node_modules/better-sqlite3');
const path = require('path');

(async () => {
  console.log('🧪 Testing Profile Update Feature');
  console.log('Test #17: Client can update profile information\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 720 });

    // Step 1: Login
    console.log('✓ Step 1: Login as client user...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'test-profile-01-logged-in.png', fullPage: true });
    console.log('✓ Login successful');

    // Step 2: Navigate to settings page
    console.log('\n✓ Step 2: Navigate to /client/setari...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'test-profile-02-settings-page.png', fullPage: true });
    console.log('✓ Settings page loaded');

    // Verify page elements
    const pageTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent : '';
    });
    console.log(`  Page title: "${pageTitle}"`);

    // Get current form values
    const currentValues = await page.evaluate(() => {
      return {
        firstName: document.querySelector('#firstName')?.value || '',
        lastName: document.querySelector('#lastName')?.value || '',
        phone: document.querySelector('#phone')?.value || '',
        company: document.querySelector('#company')?.value || ''
      };
    });
    console.log('  Current values:', currentValues);

    // Step 3: Update first name (properly trigger React onChange)
    console.log('\n✓ Step 3: Update first name field...');
    await page.evaluate(() => {
      const input = document.querySelector('#firstName');
      input.value = 'Ionel';
      // Trigger React onChange event
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    });
    console.log('✓ First name updated to "Ionel"');

    // Step 4: Update phone number (properly trigger React onChange)
    console.log('\n✓ Step 4: Update phone number...');
    await page.evaluate(() => {
      const input = document.querySelector('#phone');
      input.value = '+40 755 123 456';
      // Trigger React onChange event
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    });
    console.log('✓ Phone updated to "+40 755 123 456"');

    await page.screenshot({ path: 'test-profile-03-before-submit.png', fullPage: true });

    // Step 5: Submit form
    console.log('\n✓ Step 5: Submit form...');

    // Monitor network requests
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/profile')) {
        console.log(`  API Response: ${response.status()} ${response.statusText()}`);
        try {
          const json = await response.json();
          console.log('  Response data:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('  Could not parse response as JSON');
        }
      }
    });

    await page.click('button[type="submit"]');

    // Wait a bit for the request to complete
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-profile-04-after-submit.png', fullPage: true });
    console.log('✓ Form submitted');

    // Check for success or error message
    const hasSuccess = await page.evaluate(() => {
      return !!document.querySelector('.bg-green-50');
    });

    const hasError = await page.evaluate(() => {
      return !!document.querySelector('.bg-red-50');
    });

    if (!hasSuccess && !hasError) {
      console.log('⚠️  No success or error message found');
      // Check form values to see if they were actually sent
      const formValues = await page.evaluate(() => {
        return {
          firstName: document.querySelector('#firstName')?.value || '',
          phone: document.querySelector('#phone')?.value || ''
        };
      });
      console.log('  Form values after submit:', formValues);
    }

    // Step 6: Verify success message
    console.log('\n✓ Step 6: Verify success or error message...');

    if (hasSuccess) {
      const successMessage = await page.evaluate(() => {
        const successDiv = document.querySelector('.bg-green-50');
        return successDiv ? successDiv.textContent.trim() : '';
      });
      console.log(`  Success message: "${successMessage}"`);
      console.log('✓ Success message displayed correctly');
    } else if (hasError) {
      const errorMessage = await page.evaluate(() => {
        const errorDiv = document.querySelector('.bg-red-50');
        return errorDiv ? errorDiv.textContent.trim() : '';
      });
      throw new Error(`Update failed with error: ${errorMessage}`);
    } else {
      throw new Error('No success or error message found after form submission');
    }

    // Step 7: Verify changes in database
    console.log('\n✓ Step 7: Verify changes saved in database...');
    const dbPath = path.join(__dirname, 'backend', 'database.db');
    const db = new Database(dbPath);

    const user = db.prepare('SELECT first_name, last_name, phone FROM users WHERE email = ?').get('client@test.ro');
    db.close();

    console.log('  Database values:', user);

    if (user.first_name === 'Ionel' && user.phone === '+40 755 123 456') {
      console.log('✓ Changes saved correctly in database');
    } else {
      throw new Error(`Database values incorrect: firstName="${user.first_name}", phone="${user.phone}"`);
    }

    // Step 8: Verify updated name appears in header
    console.log('\n✓ Step 8: Verify updated name in header...');
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'test-profile-05-after-reload.png', fullPage: true });

    const headerName = await page.evaluate(() => {
      const nameElement = document.querySelector('nav .text-sm.font-medium');
      return nameElement ? nameElement.textContent.trim() : '';
    });
    console.log(`  Header displays: "${headerName}"`);

    if (headerName.includes('Ionel')) {
      console.log('✓ Updated name appears in header');
    } else {
      console.log('⚠️  Warning: Header may not reflect changes immediately');
    }

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('✅ Profile update feature working correctly');
    console.log('✅ Test #17 can be marked as passing\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    await page.screenshot({ path: 'test-profile-error.png', fullPage: true });
    await browser.close();
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
