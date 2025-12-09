// Test if ticket click now works after bug fix
import puppeteer from 'puppeteer';

async function testClickFixed() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to support
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');
    await page.screenshot({ path: 'fixed-01-before-click.png', fullPage: true });

    console.log('Clicking ticket card...');
    const card = await page.$('.cursor-pointer');
    await card.click();

    // Wait for detail view
    await page.waitForSelector('textarea', { timeout: 5000 });
    await page.screenshot({ path: 'fixed-02-after-click.png', fullPage: true });

    console.log('✅ SUCCESS! Ticket detail view loaded');
    console.log('Textarea found - detail view is working!');

    // Check for file input
    const fileInput = await page.$('input[type="file"]');
    console.log('File input found:', !!fileInput);

    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testClickFixed().catch(console.error);
