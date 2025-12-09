const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Debug: Finding logout button');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Login first
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log('✓ Logged in');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find all buttons
    const buttons = await page.$$('button');
    console.log(`\nFound ${buttons.length} buttons on page`);

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const html = await page.evaluate(el => el.outerHTML, button);
      const text = await page.evaluate(el => el.textContent, button);
      const title = await page.evaluate(el => el.getAttribute('title'), button);

      console.log(`\nButton ${i + 1}:`);
      console.log(`  Title: ${title || 'none'}`);
      console.log(`  Text: ${text.trim() || 'none'}`);
      if (html.includes('log-out') || html.toLowerCase().includes('logout')) {
        console.log(`  ✅ Contains logout icon!`);
        console.log(`  HTML: ${html.substring(0, 200)}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
