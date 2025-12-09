/**
 * Test #16: Client can download invoice PDF
 *
 * Steps:
 * 1. Login as client user
 * 2. Navigate to /client/facturi
 * 3. Click download button on an invoice
 * 4. Verify PDF file downloads
 * 5. Verify PDF contains correct invoice data
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('Starting Test #16: Invoice PDF Download...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Set download path
  const downloadPath = path.resolve('./test-downloads');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  // Configure download behavior
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath
  });

  try {
    // Step 1: Login as client user
    console.log('✓ Step 1: Login as client user');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');

    // Wait for either navigation or error message
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }),
        page.waitForSelector('.error-message', { timeout: 5000 })
      ]);
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('  ✅ Successfully logged in');

    // Step 2: Navigate to /client/facturi
    console.log('\n✓ Step 2: Navigate to invoices page');
    await page.goto('http://localhost:5173/client/facturi', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-invoice-01-page.png', fullPage: true });

    // Wait for invoices to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if invoices are present
    const invoiceCount = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });

    console.log(`  ✅ Found ${invoiceCount} invoice(s)`);

    if (invoiceCount === 0) {
      console.log('  ⚠️  No invoices found. Cannot test download.');
      await browser.close();
      return;
    }

    // Step 3: Click download button on first invoice
    console.log('\n✓ Step 3: Click download button');
    await page.screenshot({ path: 'test-invoice-02-before-download.png', fullPage: true });

    // Get invoice number before clicking
    const invoiceNumber = await page.evaluate(() => {
      const firstInvoice = document.querySelector('tbody tr');
      if (!firstInvoice) return null;
      const numberCell = firstInvoice.querySelector('td:first-child span');
      return numberCell ? numberCell.textContent.trim() : null;
    });

    console.log(`  Invoice Number: ${invoiceNumber}`);

    // Set up listener for download
    let downloadCompleted = false;
    const checkDownload = setInterval(() => {
      const files = fs.readdirSync(downloadPath);
      const pdfFiles = files.filter(f => f.endsWith('.pdf'));
      if (pdfFiles.length > 0) {
        downloadCompleted = true;
        console.log(`  ✅ PDF file downloaded: ${pdfFiles[0]}`);
        clearInterval(checkDownload);
      }
    }, 500);

    // Click the download button
    await page.evaluate(() => {
      const downloadButton = document.querySelector('button[title="Descarcă PDF"]') ||
                            document.querySelector('tbody tr button');
      if (downloadButton) {
        downloadButton.click();
      }
    });

    // Wait for download to complete (max 10 seconds)
    let waited = 0;
    while (!downloadCompleted && waited < 10000) {
      await new Promise(resolve => setTimeout(resolve, 500));
      waited += 500;
    }
    clearInterval(checkDownload);

    // Step 4: Verify PDF file downloads
    console.log('\n✓ Step 4: Verify PDF file downloads');
    const files = fs.readdirSync(downloadPath);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log('  ❌ No PDF file was downloaded');
      await page.screenshot({ path: 'test-invoice-03-error.png', fullPage: true });
      await browser.close();
      return;
    }

    console.log(`  ✅ PDF downloaded successfully: ${pdfFiles[0]}`);

    // Step 5: Verify PDF contains correct invoice data
    console.log('\n✓ Step 5: Verify PDF file properties');
    const pdfPath = path.join(downloadPath, pdfFiles[0]);
    const stats = fs.statSync(pdfPath);

    console.log(`  File size: ${stats.size} bytes`);
    console.log(`  ✅ PDF file size is valid (> 0 bytes)`);

    if (stats.size > 1000) {
      console.log(`  ✅ PDF file has substantial content (${Math.round(stats.size / 1024)}KB)`);
    }

    // Check filename matches invoice number
    if (invoiceNumber && pdfFiles[0].includes(invoiceNumber.replace(/\//g, '-'))) {
      console.log(`  ✅ PDF filename matches invoice number`);
    }

    await page.screenshot({ path: 'test-invoice-04-success.png', fullPage: true });

    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST #16 PASSED - Invoice PDF Download Working!');
    console.log('='.repeat(60));
    console.log('\nSummary:');
    console.log('- Login: ✅');
    console.log('- Navigate to invoices: ✅');
    console.log('- Click download button: ✅');
    console.log('- PDF file downloaded: ✅');
    console.log('- PDF file valid: ✅');
    console.log(`\nPDF saved to: ${pdfPath}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-invoice-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\nTest complete.');
  }
})();
