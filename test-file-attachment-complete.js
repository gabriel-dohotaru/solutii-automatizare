// Complete file attachment test with better verification
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testCompleteFileAttachment() {
  console.log('Starting complete file attachment test...\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 50
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Create test file
    const testFilePath = path.join(process.cwd(), 'test-attachment.txt');
    fs.writeFileSync(testFilePath, 'This is a test file attachment for the support ticket system.');
    console.log('✓ Created test file');

    // Login
    console.log('\n1. Logging in...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'client@test.ro');
    await page.type('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✓ Logged in');

    // Navigate to support
    console.log('\n2. Navigating to support tickets...');
    await page.goto('http://localhost:5173/client/suport', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.space-y-4');
    console.log('✓ On support page');

    // Click ticket
    console.log('\n3. Opening ticket...');
    const ticketCard = await page.$('.cursor-pointer');
    await ticketCard.click();
    await page.waitForSelector('textarea', { timeout: 5000 });
    await page.screenshot({ path: 'complete-01-ticket-opened.png', fullPage: true });
    console.log('✓ Ticket opened');

    // Count initial messages
    const initialMessageCount = await page.evaluate(() => {
      const messages = document.querySelectorAll('.bg-indigo-600, .bg-slate-100');
      return messages.length;
    });
    console.log(`Initial message count: ${initialMessageCount}`);

    // Type message
    console.log('\n4. Typing reply message...');
    await page.type('textarea', 'Testing file attachment feature. Please check the attached file.');
    console.log('✓ Message typed');

    // Upload file
    console.log('\n5. Uploading file...');
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(testFilePath);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'complete-02-file-selected.png', fullPage: true });
    console.log('✓ File selected');

    // Submit
    console.log('\n6. Submitting reply...');
    const submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Trimite'));
    });
    await submitButton.asElement().click();
    console.log('✓ Submit button clicked');

    // Wait for submission
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check if message count increased
    const newMessageCount = await page.evaluate(() => {
      const messages = document.querySelectorAll('.bg-indigo-600, .bg-slate-100');
      return messages.length;
    });
    console.log(`\nNew message count: ${newMessageCount}`);

    // Scroll to bottom to see new messages
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'complete-03-after-submit.png', fullPage: true });

    // Check for attachment in page
    const pageContent = await page.content();
    const hasFilename = pageContent.includes('test-attachment.txt');
    console.log(`\nFile name in page: ${hasFilename ? '✓ YES' : '✗ NO'}`);

    // Look for download links
    const downloadLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .filter(link => link.href.includes('attachments'))
        .map(link => ({ href: link.href, text: link.textContent }));
    });
    console.log(`Download links found: ${downloadLinks.length}`);
    if (downloadLinks.length > 0) {
      console.log('Links:', JSON.stringify(downloadLinks, null, 2));
    }

    // Verify server-side file exists
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'tickets');
    const uploadedFiles = fs.readdirSync(uploadsDir);
    const recentFile = uploadedFiles.find(f => f.includes('test-attachment'));
    console.log(`\nFile on server: ${recentFile ? '✓ ' + recentFile : '✗ NOT FOUND'}`);

    // Clean up
    fs.unlinkSync(testFilePath);
    console.log('\n✓ Test file cleaned up');

    if (newMessageCount > initialMessageCount && hasFilename && recentFile) {
      console.log('\n✅ FILE ATTACHMENT TEST PASSED!');
      console.log('- Message submitted successfully');
      console.log('- File appears in UI');
      console.log('- File saved on server');
      return true;
    } else {
      console.log('\n⚠️ TEST INCOMPLETE - Some checks failed');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  } finally {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

testCompleteFileAttachment()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
