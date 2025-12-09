const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Click Detection Test');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add click listener to the button via JavaScript
    const wasClicked = await page.evaluate(() => {
      const button = document.querySelector('button.p-2.text-slate-500');
      if (!button) return { found: false };

      let clicked = false;
      button.addEventListener('click', () => {
        console.log('BUTTON WAS CLICKED!');
        clicked = true;
      });

      // Check if it already has an onClick handler
      const hasOnClick = button.onclick !== null;
      const reactProps = Object.keys(button).filter(key => key.startsWith('__react'));

      return {
        found: true,
        hasOnClick,
        reactPropsFound: reactProps.length > 0,
        buttonHTML: button.outerHTML
      };
    });

    console.log('Button info:', JSON.stringify(wasClicked, null, 2));

    if (wasClicked.found) {
      // Now click it
      const button = await page.$('button.p-2.text-slate-500');
      await button.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
