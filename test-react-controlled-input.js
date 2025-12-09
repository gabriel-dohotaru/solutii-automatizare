// Test React controlled input with Puppeteer
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testReactInput() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Monitor API calls
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/client/tickets') && url.includes('/messages')) {
        console.log(`\n📡 API ${response.status()}: ${url}`);
        const text = await response.text();
        console.log('Response:', text.substring(0, 300));
      }
    });

    // Create test file
    const testFilePath = path.join(process.cwd(), 'test-react.txt');
    fs.writeFileSync(testFilePath, 'Testing React controlled inputs');

    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to support
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.cursor-pointer');

    // Click ticket
    const ticket = await page.$('.cursor-pointer');
    await ticket.click();
    await page.waitForSelector('textarea', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✓ Ticket opened\n');

    // Method 1: Try clicking textarea first, then typing
    console.log('Method 1: Click + Type');
    const textarea = await page.$('textarea');
    await textarea.click();
    await page.type('textarea', 'Message via puppeteer typing');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if React state was updated
    const textareaValue = await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      return ta ? ta.value : null;
    });
    console.log('Textarea value:', textareaValue);

    // Upload file
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(testFilePath);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✓ File uploaded');

    await page.screenshot({ path: 'react-test-before.png', fullPage: true });

    // Submit
    console.log('\nSubmitting form...');
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();

    await new Promise(resolve => setTimeout(resolve, 4000));

    await page.screenshot({ path: 'react-test-after.png', fullPage: true });

    // Cleanup
    fs.unlinkSync(testFilePath);

    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testReactInput().catch(console.error);
