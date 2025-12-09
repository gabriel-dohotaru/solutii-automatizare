// Debug test to see what happens when clicking ticket
import puppeteer from 'puppeteer';

async function debugTicketClick() {
  console.log('Starting debug test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 100 // Slow down by 100ms to see what's happening
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Login
    console.log('Step 1: Login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✓ Logged in');

    // Navigate to support
    console.log('\nStep 2: Go to support...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'debug-01-support-page.png', fullPage: true });
    console.log('✓ On support page');

    // Check what's on the page
    console.log('\nChecking page content...');
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page text preview:', pageText.substring(0, 500));

    // Wait for tickets
    await page.waitForSelector('.space-y-4', { timeout: 5000 });
    console.log('✓ Tickets container found');

    // Get all clickable elements
    const clickableElements = await page.$$('.cursor-pointer');
    console.log(`Found ${clickableElements.length} clickable elements`);

    if (clickableElements.length > 0) {
      console.log('\nClicking first clickable element...');
      await clickableElements[0].click();

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 3000));

      await page.screenshot({ path: 'debug-02-after-click.png', fullPage: true });

      // Check if anything changed
      const pageTextAfter = await page.evaluate(() => document.body.innerText);
      console.log('\nPage text after click preview:', pageTextAfter.substring(0, 500));

      // Check for textarea
      const textareaExists = await page.$('textarea');
      console.log('Textarea found:', textareaExists !== null);

      // Check for file input
      const fileInputExists = await page.$('input[type="file"]');
      console.log('File input found:', fileInputExists !== null);

      // Check console errors
      const logs = [];
      page.on('console', msg => logs.push(msg.text()));
      console.log('\nConsole logs:', logs);
    }

    console.log('\nDebug test completed. Check screenshots.');

    // Keep browser open for 10 seconds to inspect
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugTicketClick().catch(console.error);
