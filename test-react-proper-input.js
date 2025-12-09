// Test React controlled input with proper event triggering
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testProperReactInput() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Monitor API
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/client/tickets') && url.includes('/messages')) {
        console.log(`\n📡 API ${response.status()}: ${url}`);
        const text = await response.text();
        console.log('Response:', text);
      }
    });

    // Create test file
    const testFilePath = path.join(process.cwd(), 'test-proper.txt');
    fs.writeFileSync(testFilePath, 'Test file content for proper React input test');

    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to support
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.cursor-pointer');
    const ticket = await page.$('.cursor-pointer');
    await ticket.click();
    await page.waitForSelector('textarea', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✓ Ticket opened\n');

    // Proper way to set React controlled textarea value
    const messageText = 'This is a test message with proper React state update!';
    await page.evaluate((text) => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        // Set the value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(textarea, text);

        // Trigger React's onChange by dispatching input event
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
      }
    }, messageText);

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`✓ Message set: "${messageText}"`);

    // Verify it worked
    const textareaValue = await page.evaluate(() => document.querySelector('textarea').value);
    console.log(`Textarea DOM value: "${textareaValue}"`);

    // Upload file
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(testFilePath);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✓ File uploaded');

    await page.screenshot({ path: 'proper-before-submit.png', fullPage: true });

    // Submit
    console.log('\nSubmitting...');
    const submitBtn = await page.$('button[type="submit"]');
    const isDisabled = await page.evaluate(btn => btn.disabled, submitBtn);
    console.log('Submit button disabled:', isDisabled);

    if (!isDisabled) {
      await submitBtn.click();
      console.log('✓ Submit clicked');
    } else {
      console.log('❌ Submit button is disabled!');
    }

    await new Promise(resolve => setTimeout(resolve, 4000));

    await page.screenshot({ path: 'proper-after-submit.png', fullPage: true });

    // Check for new message in UI
    const messageCount = await page.evaluate(() => {
      return document.querySelectorAll('.bg-indigo-600, .bg-slate-100').length;
    });
    console.log(`\nMessages in UI: ${messageCount}`);

    // Check uploads directory
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'tickets');
    const files = fs.readdirSync(uploadsDir);
    console.log(`Files uploaded: ${files.length}`);
    if (files.length > 0) {
      console.log('Latest file:', files[files.length - 1]);
    }

    // Cleanup
    fs.unlinkSync(testFilePath);

    if (messageCount >= 2 && files.length > 0) {
      console.log('\n✅ TEST PASSED! File attachment feature works!');
    } else {
      console.log('\n⚠️ Test incomplete');
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testProperReactInput().catch(console.error);
