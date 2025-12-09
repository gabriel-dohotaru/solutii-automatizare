const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Direct Handler Test');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  // Listen to console
  page.on('console', msg => console.log(`[BROWSER]:`, msg.text()));

  try {
    // Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✓ Logged in');

    // Try to call the onClick handler directly
    const result = await page.evaluate(() => {
      const button = document.querySelector('button.p-2.text-slate-500');
      if (!button) return { error: 'Button not found' };

      console.log('Found button, looking for React props...');

      // Find React fiber
      const reactKey = Object.keys(button).find(key => key.startsWith('__reactProps'));
      if (reactKey) {
        console.log('Found React props key:', reactKey);
        const props = button[reactKey];
        console.log('Props:', Object.keys(props));

        if (props.onClick) {
          console.log('Calling onClick handler directly...');
          try {
            props.onClick({ preventDefault: () => {}, stopPropagation: () => {} });
            return { success: true, calledHandler: true };
          } catch (e) {
            return { error: 'Error calling handler: ' + e.message };
          }
        }
      }

      return { error: 'No onClick found in React props' };
    });

    console.log('Result:', result);
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Final URL:', page.url());

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
