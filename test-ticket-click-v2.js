// Test clicking ticket with different methods
import puppeteer from 'puppeteer';

async function testClick() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 50
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error.message));

    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to support
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');

    console.log('\n=== Method 1: Regular click ===');
    const card1 = await page.$('.cursor-pointer');
    if (card1) {
      await card1.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hasTextarea1 = await page.$('textarea');
      console.log('Textarea found:', !!hasTextarea1);
    }

    // Reload page for next test
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');

    console.log('\n=== Method 2: Click with force ===');
    const card2 = await page.$('.cursor-pointer');
    if (card2) {
      await card2.click({ clickCount: 1, delay: 100 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hasTextarea2 = await page.$('textarea');
      console.log('Textarea found:', !!hasTextarea2);
    }

    // Reload page for next test
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');

    console.log('\n=== Method 3: Click via JavaScript ===');
    await page.evaluate(() => {
      const card = document.querySelector('.cursor-pointer');
      if (card) {
        card.click();
      }
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasTextarea3 = await page.$('textarea');
    console.log('Textarea found:', !!hasTextarea3);

    // Reload page for next test
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');

    console.log('\n=== Method 4: Click on title inside card ===');
    const title = await page.$('h3.text-lg');
    if (title) {
      await title.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hasTextarea4 = await page.$('textarea');
      console.log('Textarea found:', !!hasTextarea4);
    }

    await page.screenshot({ path: 'test-click-final.png', fullPage: true });

    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testClick().catch(console.error);
