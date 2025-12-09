const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Packages Page Test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('Step 1: Navigate to /pachete');
    await page.goto('http://localhost:5173/pachete', { waitUntil: 'networkidle0', timeout: 10000 });
    await page.screenshot({ path: 'test-packages-01-page.png', fullPage: true });
    console.log('✅ Step 1 passed - Page loaded');

    console.log('\nStep 2: Verify Starter package card displays');
    const starterExists = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Starter') &&
             text.includes('500') &&
             text.includes('1 modul custom');
    });
    if (starterExists) {
      console.log('✅ Step 2 passed - Starter package found');
    } else {
      console.log('❌ Step 2 failed - Starter package not found');
      await browser.close();
      return;
    }

    console.log('\nStep 3: Verify Professional package card displays');
    const professionalExists = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Professional') &&
             text.includes('1,500') &&
             text.includes('Până la 5 module/integrări');
    });
    if (professionalExists) {
      console.log('✅ Step 3 passed - Professional package found');
    } else {
      console.log('❌ Step 3 failed - Professional package not found');
      await browser.close();
      return;
    }

    console.log('\nStep 4: Verify Enterprise package card displays');
    const enterpriseExists = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Enterprise') &&
             text.includes('Custom') &&
             text.includes('Echipă dedicată');
    });
    if (enterpriseExists) {
      console.log('✅ Step 4 passed - Enterprise package found');
    } else {
      console.log('❌ Step 4 failed - Enterprise package not found');
      await browser.close();
      return;
    }

    console.log('\nStep 5: Verify all package features are listed');
    const featuresExist = await page.evaluate(() => {
      const checkIcons = document.querySelectorAll('svg[class*="lucide"]');
      // Should have multiple check icons for features
      return checkIcons.length > 10;
    });
    if (featuresExist) {
      console.log('✅ Step 5 passed - Package features are listed');
    } else {
      console.log('❌ Step 5 failed - Package features not properly displayed');
      await browser.close();
      return;
    }

    console.log('\nStep 6: Verify pricing information is visible');
    const pricingVisible = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('De la') &&
             text.includes('€') &&
             text.includes('Preț pe proiect');
    });
    if (pricingVisible) {
      console.log('✅ Step 6 passed - Pricing information is visible');
    } else {
      console.log('❌ Step 6 failed - Pricing information not visible');
      await browser.close();
      return;
    }

    console.log('\nStep 7: Verify add-ons section exists');
    await page.screenshot({ path: 'test-packages-02-before-scroll.png', fullPage: true });

    // Scroll to add-ons section
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    const addOnsExist = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Servicii Adiționale') ||
             text.includes('Mentenanță Lunară') ||
             text.includes('Support Premium');
    });

    await page.screenshot({ path: 'test-packages-03-addons.png', fullPage: true });

    if (addOnsExist) {
      console.log('✅ Step 7 passed - Add-ons section exists');
    } else {
      console.log('❌ Step 7 failed - Add-ons section not found');
      await browser.close();
      return;
    }

    // Check for console errors
    if (consoleErrors.length > 0) {
      console.log('\n⚠️ Console Errors Detected:');
      consoleErrors.forEach(err => console.log('  -', err));
    } else {
      console.log('\n✅ No console errors detected');
    }

    console.log('\n========================================');
    console.log('✅ ALL TEST STEPS PASSED - Test #24');
    console.log('========================================');

    await browser.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();
