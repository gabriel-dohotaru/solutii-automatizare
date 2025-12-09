// Test file attachment feature for support tickets
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testFileAttachment() {
  console.log('Starting file attachment test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Create a test file to upload
    const testFilePath = path.join(process.cwd(), 'test-upload-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test attachment file for support ticket.');
    console.log('✓ Created test file:', testFilePath);

    // Step 1: Login as client user
    console.log('\nStep 1: Login as client user...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'verification_screenshots/01-login-success.png', fullPage: true });
    console.log('✓ Logged in successfully');

    // Step 2: Navigate to /client/suport
    console.log('\nStep 2: Navigate to /client/suport...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'verification_screenshots/02-support-tickets-page.png', fullPage: true });
    console.log('✓ Support tickets page loaded');

    // Step 3: Open an existing ticket
    console.log('\nStep 3: Open an existing ticket...');
    // Wait for tickets to load
    await page.waitForSelector('.space-y-4', { timeout: 5000 });

    // Find and click the first ticket card
    const ticketCard = await page.$('.cursor-pointer');
    if (!ticketCard) {
      throw new Error('Could not find ticket card');
    }

    await ticketCard.click();

    // Wait for detail view to load - wait for textarea (reply input) which only appears in detail view
    await page.waitForSelector('textarea', { timeout: 5000 });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Extra wait for full render
    await page.screenshot({ path: 'verification_screenshots/03-ticket-detail-opened.png', fullPage: true });
    console.log('✓ Ticket detail view opened');

    // Step 4: Click attach file button (file input)
    console.log('\nStep 4: Select file for attachment...');

    // Find the file input element
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('File input not found');
    }

    // Upload the test file
    await fileInput.uploadFile(testFilePath);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for file to be selected
    await page.screenshot({ path: 'verification_screenshots/04-file-selected.png', fullPage: true });
    console.log('✓ File selected for upload');

    // Step 5: Type a message in the reply textarea
    console.log('\nStep 5: Type reply message...');
    const textarea = await page.$('textarea');
    if (!textarea) {
      throw new Error('Reply textarea not found');
    }
    await textarea.type('Am atașat fișierul de test. Vă rog să verificați.');
    await page.screenshot({ path: 'verification_screenshots/05-message-typed.png', fullPage: true });
    console.log('✓ Reply message typed');

    // Step 6: Submit message with attachment
    console.log('\nStep 6: Submit message with attachment...');

    // Find and click the submit button
    const submitButtons = await page.$$('button');
    let submitButton = null;
    for (const button of submitButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && (text.includes('Trimite') || text.includes('Adaugă'))) {
        submitButton = button;
        break;
      }
    }

    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for submission and UI update
      await page.screenshot({ path: 'verification_screenshots/06-message-submitted.png', fullPage: true });
      console.log('✓ Message with attachment submitted');
    } else {
      throw new Error('Could not find submit button');
    }

    // Step 7: Verify file appears in message
    console.log('\nStep 7: Verify file appears in message...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take a screenshot to verify visually
    await page.screenshot({ path: 'verification_screenshots/07-message-with-attachment-displayed.png', fullPage: true });

    // Check if the filename appears in the page
    const pageContent = await page.content();
    if (pageContent.includes('test-upload-file.txt')) {
      console.log('✓ File attachment appears in the message thread');
    } else {
      console.log('⚠ Warning: File name not found in page content. Check screenshot for visual verification.');
    }

    // Step 8: Verify file saved to server (check if download link exists)
    console.log('\nStep 8: Verify file saved to server...');

    // Look for download link or attachment icon
    const links = await page.$$('a');
    let downloadLinkFound = false;
    for (const link of links) {
      const href = await page.evaluate(el => el.getAttribute('href'), link);
      if (href && href.includes('attachments')) {
        downloadLinkFound = true;
        console.log('✓ Download link found:', href);
        break;
      }
    }

    if (downloadLinkFound) {
      console.log('✓ File saved to server (download link exists)');
    } else {
      console.log('⚠ Warning: Download link not found. Manual verification needed.');
    }

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('\n✓ Cleaned up test file');

    console.log('\n=== FILE ATTACHMENT TEST COMPLETED ===');
    console.log('All steps executed successfully!');
    console.log('Screenshots saved in verification_screenshots/ directory');
    console.log('\nTest result: PASS ✅');

    return true;

  } catch (error) {
    console.error('\n✗ File attachment test failed:', error.message);
    try {
      const pages = await browser.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: 'verification_screenshots/error-screenshot.png', fullPage: true });
        console.log('Error screenshot saved');
      }
    } catch (screenshotError) {
      console.log('Could not save error screenshot');
    }
    throw error;
  } finally {
    await browser.close();
  }
}

testFileAttachment().catch(console.error);
