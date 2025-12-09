const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing Services Page (Test #21)...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Monitor console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Step 1: Navigate to /servicii
    console.log('Step 1: Navigate to /servicii...');
    await page.goto('http://localhost:5173/servicii', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-services-01-page.png' });

    // Verify page loaded
    const url = page.url();
    if (!url.includes('/servicii')) {
      throw new Error('Not on services page');
    }
    console.log('✅ Step 1 passed\n');

    // Step 2: Verify 'Module E-commerce' section displays
    console.log('Step 2: Verify "Module E-commerce" section displays...');
    const ecommerceSection = await page.$('#ecommerce');
    if (!ecommerceSection) {
      throw new Error('Module E-commerce section not found');
    }

    // Check if the heading exists
    const ecommerceHeading = await page.evaluate(() => {
      const section = document.querySelector('#ecommerce');
      if (!section) return null;
      const h2 = section.querySelector('h2');
      return h2 ? h2.textContent : null;
    });

    if (!ecommerceHeading || !ecommerceHeading.includes('Module E-commerce')) {
      throw new Error('Module E-commerce heading not found or incorrect');
    }
    console.log('  Found:', ecommerceHeading);
    console.log('✅ Step 2 passed\n');

    // Step 3: Verify 'Automatizări Software' section displays
    console.log('Step 3: Verify "Automatizări Software" section displays...');
    const automationSection = await page.$('#automation');
    if (!automationSection) {
      throw new Error('Automatizări Software section not found');
    }

    const automationHeading = await page.evaluate(() => {
      const section = document.querySelector('#automation');
      if (!section) return null;
      const h2 = section.querySelector('h2');
      return h2 ? h2.textContent : null;
    });

    if (!automationHeading || !automationHeading.includes('Automatizări Software')) {
      throw new Error('Automatizări Software heading not found or incorrect');
    }
    console.log('  Found:', automationHeading);
    console.log('✅ Step 3 passed\n');

    // Step 4: Verify 'Bug Fixing & Mentenanță' section displays
    console.log('Step 4: Verify "Bug Fixing & Mentenanță" section displays...');
    const bugfixSection = await page.$('#bugfix');
    if (!bugfixSection) {
      throw new Error('Bug Fixing & Mentenanță section not found');
    }

    const bugfixHeading = await page.evaluate(() => {
      const section = document.querySelector('#bugfix');
      if (!section) return null;
      const h2 = section.querySelector('h2');
      return h2 ? h2.textContent : null;
    });

    if (!bugfixHeading || !bugfixHeading.includes('Bug Fixing')) {
      throw new Error('Bug Fixing & Mentenanță heading not found or incorrect');
    }
    console.log('  Found:', bugfixHeading);
    console.log('✅ Step 4 passed\n');

    // Step 5: Verify 'Dezvoltare Web Custom' section displays
    console.log('Step 5: Verify "Dezvoltare Web Custom" section displays...');
    const webdevSection = await page.$('#webdev');
    if (!webdevSection) {
      throw new Error('Dezvoltare Web Custom section not found');
    }

    const webdevHeading = await page.evaluate(() => {
      const section = document.querySelector('#webdev');
      if (!section) return null;
      const h2 = section.querySelector('h2');
      return h2 ? h2.textContent : null;
    });

    if (!webdevHeading || !webdevHeading.includes('Dezvoltare Web Custom')) {
      throw new Error('Dezvoltare Web Custom heading not found or incorrect');
    }
    console.log('  Found:', webdevHeading);
    console.log('✅ Step 5 passed\n');

    // Step 6: Verify process timeline section exists
    console.log('Step 6: Verify process timeline section exists...');
    const timelineHeading = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const timeline = headings.find(h => h.textContent.includes('Cum Lucrăm'));
      return timeline ? timeline.textContent : null;
    });

    if (!timelineHeading) {
      throw new Error('Process timeline section not found');
    }
    console.log('  Found:', timelineHeading);
    await page.screenshot({ path: 'test-services-02-timeline.png' });
    console.log('✅ Step 6 passed\n');

    // Step 7: Verify FAQ accordion exists
    console.log('Step 7: Verify FAQ accordion exists...');
    const faqHeading = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const faq = headings.find(h => h.textContent.includes('Întrebări Frecvente'));
      return faq ? faq.textContent : null;
    });

    if (!faqHeading) {
      throw new Error('FAQ section not found');
    }
    console.log('  Found:', faqHeading);

    // Scroll to FAQ section
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const faq = headings.find(h => h.textContent.includes('Întrebări Frecvente'));
      if (faq) faq.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Wait a bit for smooth scroll
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'test-services-03-faq.png' });
    console.log('✅ Step 7 passed\n');

    // Check for console errors
    if (errors.length > 0) {
      console.log('\n⚠️ Console errors detected:');
      errors.forEach(err => console.log('  -', err));
    } else {
      console.log('✅ No console errors detected\n');
    }

    console.log('========================================');
    console.log('Test #21: ALL STEPS PASSED ✅');
    console.log('========================================');
    console.log('\nServices page displays all required sections:');
    console.log('  ✅ Module E-commerce');
    console.log('  ✅ Automatizări Software');
    console.log('  ✅ Bug Fixing & Mentenanță');
    console.log('  ✅ Dezvoltare Web Custom');
    console.log('  ✅ Process timeline');
    console.log('  ✅ FAQ accordion');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await browser.close();
    process.exit(1);
  }

  await browser.close();
})();
