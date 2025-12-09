const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Verify logout code is loaded');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173/client', { waitUntil: 'networkidle0' });

    // Check if the logout function includes 'token' removal
    const hasTokenRemoval = await page.evaluate(() => {
      // Check the page source for the logout implementation
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const script of scripts) {
        if (script.textContent.includes('handleLogout') && script.textContent.includes('localStorage.removeItem')) {
          const hasToken = script.textContent.includes("localStorage.removeItem('token')") ||
                          script.textContent.includes('localStorage.removeItem("token")');
          return {
            found: true,
            hasTokenRemoval: hasToken,
            snippet: script.textContent.match(/handleLogout.*?\{[\s\S]{0,300}\}/)?.[0]
          };
        }
      }
      return { found: false };
    });

    console.log('Result:', JSON.stringify(hasTokenRemoval, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
