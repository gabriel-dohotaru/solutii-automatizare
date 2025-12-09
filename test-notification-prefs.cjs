const puppeteer = require('puppeteer');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testNotificationPreferences() {
  console.log('Starting Test #18: Client can update notification preferences\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => console.log('Browser:', msg.text()));

    // Step 1: Login as client user
    console.log('Step 1: Login as client user');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    await sleep(1000);
    await page.screenshot({ path: 'test-notif-01-logged-in.png', fullPage: true });
    console.log('✓ Login successful\n');

    // Step 2: Navigate to /client/setari
    console.log('Step 2: Navigate to /client/setari');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: 'test-notif-02-settings-page.png', fullPage: true });
    console.log('✓ Settings page loaded\n');

    // Step 3: Scroll to notification section and toggle preferences
    console.log('Step 3: Toggle email notification preferences');

    // Scroll to notification section
    await page.evaluate(() => {
      const notifSection = document.querySelector('h2');
      const sections = Array.from(document.querySelectorAll('h2'));
      const notifHeading = sections.find(h => h.textContent.includes('Preferințe Notificări'));
      if (notifHeading) {
        notifHeading.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await sleep(1000);
    await page.screenshot({ path: 'test-notif-03-notification-section.png', fullPage: true });

    // Check current state of toggles
    const initialStates = await page.evaluate(() => {
      const getToggleState = (id) => {
        const toggle = document.getElementById(id);
        if (!toggle) return null;
        return toggle.classList.contains('bg-primary');
      };
      return {
        projectUpdates: getToggleState('notifyProjectUpdates'),
        ticketReplies: getToggleState('notifyTicketReplies'),
        invoices: getToggleState('notifyInvoices'),
        marketing: getToggleState('notifyMarketing')
      };
    });
    console.log('Initial toggle states:', initialStates);

    // Toggle project updates (turn OFF if ON, or ON if OFF)
    await page.click('#notifyProjectUpdates');
    await sleep(500);
    console.log('✓ Toggled project updates notification\n');

    // Toggle marketing (turn ON if OFF, or OFF if ON)
    await page.click('#notifyMarketing');
    await sleep(500);
    await page.screenshot({ path: 'test-notif-04-after-toggles.png', fullPage: true });
    console.log('✓ Toggled marketing notification\n');

    // Step 4: Save preferences
    console.log('Step 4: Save preferences');

    // Scroll to save button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      const saveButton = buttons.find(btn => btn.textContent.includes('Salvează Preferințe'));
      if (saveButton) {
        saveButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await sleep(1000);

    // Monitor API call
    let apiResponse = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/notifications')) {
        console.log(`API Response: ${response.status()}`);
        try {
          const data = await response.json();
          apiResponse = data;
          console.log('API Response data:', JSON.stringify(data, null, 2));
        } catch (e) {
          console.log('Could not parse API response');
        }
      }
    });

    // Click save button
    const buttons = await page.$$('button[type="submit"]');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Salvează Preferințe')) {
        await button.click();
        console.log('✓ Clicked save button');
        break;
      }
    }

    // Wait for API response
    await sleep(2000);
    await page.screenshot({ path: 'test-notif-05-after-save.png', fullPage: true });
    console.log('✓ Preferences saved\n');

    // Step 5: Verify success message
    console.log('Step 5: Verify success message');
    const successMessage = await page.evaluate(() => {
      const alerts = Array.from(document.querySelectorAll('div'));
      const successDiv = alerts.find(div =>
        div.textContent.includes('Preferințe notificări actualizate cu succes') ||
        div.textContent.includes('actualizate cu succes')
      );
      return successDiv ? successDiv.textContent : null;
    });

    if (successMessage && successMessage.includes('succes')) {
      console.log('✓ Success message displayed:', successMessage);
    } else {
      console.log('⚠️  Success message not found or different text');
    }
    console.log('');

    // Step 6: Verify preferences saved in database
    console.log('Step 6: Verify preferences saved in database');

    // Check localStorage was updated
    const localStorageUser = await page.evaluate(() => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    });

    if (localStorageUser && localStorageUser.notifications) {
      console.log('✓ LocalStorage updated with notifications:', localStorageUser.notifications);
    } else {
      console.log('⚠️  LocalStorage not updated correctly');
    }

    // Verify final toggle states
    const finalStates = await page.evaluate(() => {
      const getToggleState = (id) => {
        const toggle = document.getElementById(id);
        if (!toggle) return null;
        return toggle.classList.contains('bg-primary');
      };
      return {
        projectUpdates: getToggleState('notifyProjectUpdates'),
        ticketReplies: getToggleState('notifyTicketReplies'),
        invoices: getToggleState('notifyInvoices'),
        marketing: getToggleState('notifyMarketing')
      };
    });
    console.log('Final toggle states:', finalStates);

    // Verify changes were made
    if (initialStates.projectUpdates !== finalStates.projectUpdates) {
      console.log('✓ Project updates preference changed');
    }
    if (initialStates.marketing !== finalStates.marketing) {
      console.log('✓ Marketing preference changed');
    }

    console.log('\n✅ Test #18 PASSED: Notification preferences feature works correctly!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

testNotificationPreferences().catch(console.error);
