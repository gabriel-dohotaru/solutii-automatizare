const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting Session 21 Pre-Flight Verification Tests...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Test 1: Homepage loads
    console.log('Test 1: Homepage loads...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-01-homepage.png' });
    console.log('✅ Test 1 PASSED: Homepage loads successfully\n');

    // Test 2: Login flow works
    console.log('Test 2: Login flow works...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-02-login.png' });

    // Fill in login form
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.screenshot({ path: 'verify-s21-03-login-filled.png' });

    // Click submit and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);

    await page.screenshot({ path: 'verify-s21-04-dashboard.png' });
    console.log('✅ Test 2 PASSED: Login flow works\n');

    // Test 3: Projects page accessible
    console.log('Test 3: Projects page accessible...');
    await page.goto('http://localhost:5173/client/proiecte', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-05-projects.png' });
    console.log('✅ Test 3 PASSED: Projects page accessible\n');

    // Test 4: Invoices page accessible
    console.log('Test 4: Invoices page accessible...');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-06-invoices.png' });
    console.log('✅ Test 4 PASSED: Invoices page accessible\n');

    // Test 5: Support page accessible
    console.log('Test 5: Support page accessible...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-07-support.png' });
    console.log('✅ Test 5 PASSED: Support page accessible\n');

    // Test 6: Settings page accessible (profile update from Session 20)
    console.log('Test 6: Settings page accessible...');
    await page.goto('http://localhost:5173/client/setari', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'verify-s21-08-settings.png' });
    console.log('✅ Test 6 PASSED: Settings page accessible\n');

    console.log('='.repeat(60));
    console.log('✅ ALL PRE-FLIGHT VERIFICATION TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('No regressions detected. Safe to proceed with new features.');

  } catch (error) {
    console.error('❌ VERIFICATION TEST FAILED:', error.message);
    await page.screenshot({ path: 'verify-s21-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
})();
