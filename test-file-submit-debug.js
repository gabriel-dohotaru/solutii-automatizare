// Debug file submission with console monitoring
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function debugFileSubmit() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 200
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Monitor console and errors
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push({ type: msg.type(), text });
      if (msg.type() === 'error' || text.includes('Error') || text.includes('Failed')) {
        console.log(`[${msg.type()}]`, text);
      }
    });

    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/client/tickets') && url.includes('/messages')) {
        console.log(`\n📡 API Response: ${response.status()} ${url}`);
        response.text().then(text => {
          console.log('Response body:', text.substring(0, 500));
        });
      }
    });

    // Create test file
    const testFilePath = path.join(process.cwd(), 'test-file.txt');
    fs.writeFileSync(testFilePath, 'Test content for debugging.');

    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to support
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');

    // Click ticket
    const ticket = await page.$('.cursor-pointer');
    await ticket.click();
    await page.waitForSelector('textarea', { timeout: 5000 });

    console.log('\n✓ Ticket detail opened\n');

    // Type message
    await page.type('textarea', 'Test message with attachment');
    console.log('✓ Message typed');

    // Upload file
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(testFilePath);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✓ File uploaded');

    // Take screenshot before submit
    await page.screenshot({ path: 'debug-before-submit.png', fullPage: true });

    // Find and click submit button
    console.log('\nLooking for submit button...');
    const buttons = await page.$$('button');
    let submitBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Trimite')) {
        submitBtn = btn;
        console.log(`Found button with text: "${text}"`);
        break;
      }
    }

    if (submitBtn) {
      console.log('\nClicking submit button...');
      await submitBtn.click();
      console.log('✓ Click event triggered');

      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 5000));

      await page.screenshot({ path: 'debug-after-submit.png', fullPage: true });

      console.log('\n=== Console Logs ===');
      logs.forEach(log => {
        if (log.text.includes('Error') || log.text.includes('Failed') || log.type === 'error') {
          console.log(`[${log.type}]`, log.text);
        }
      });
    } else {
      console.log('❌ Submit button not found!');
    }

    // Check uploads directory
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'tickets');
    const files = fs.readdirSync(uploadsDir);
    console.log(`\nFiles in uploads directory: ${files.length}`);
    if (files.length > 0) {
      console.log('Files:', files);
    }

    // Cleanup
    fs.unlinkSync(testFilePath);

    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
}

debugFileSubmit().catch(console.error);
