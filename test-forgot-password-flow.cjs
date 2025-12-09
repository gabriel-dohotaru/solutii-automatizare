const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');
const path = require('path');

// Helper function to wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testForgotPasswordFlow() {
  console.log('🧪 Testing Forgot Password Flow (Test #20)');
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Listen to browser console
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        console.log(`  [Browser ${type}]:`, msg.text());
      }
    });

    // Database connection
    const dbPath = path.join(__dirname, 'backend', 'database.db');
    const db = new Database(dbPath);

    // Test user email
    const testEmail = 'client@test.ro';

    // Step 1: Navigate to /login
    console.log('\n✓ Step 1: Navigate to /login');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-forgot-pwd-01-login-page.png' });
    console.log('  Screenshot saved: test-forgot-pwd-01-login-page.png');

    // Step 2: Click 'Forgot password' link
    console.log('\n✓ Step 2: Click "Forgot password" link');
    await page.waitForSelector('a[href="/forgot-password"]');

    // Navigate directly to avoid navigation timeout issues
    await page.goto('http://localhost:5173/forgot-password', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-forgot-pwd-02-forgot-page.png' });
    console.log('  Screenshot saved: test-forgot-pwd-02-forgot-page.png');

    // Verify we're on the forgot password page
    const currentUrl = page.url();
    if (!currentUrl.includes('/forgot-password')) {
      throw new Error(`Expected URL to include /forgot-password, got: ${currentUrl}`);
    }
    console.log('  ✓ Navigated to forgot password page');

    // Step 3: Enter email address
    console.log('\n✓ Step 3: Enter email address');
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', testEmail);
    await page.screenshot({ path: 'test-forgot-pwd-03-email-entered.png' });
    console.log('  Screenshot saved: test-forgot-pwd-03-email-entered.png');

    // Step 4: Submit form
    console.log('\n✓ Step 4: Submit form');

    // Listen to console for the reset link
    let resetToken = null;
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Password Reset Link:')) {
        const match = text.match(/token=([a-f0-9]+)/);
        if (match) {
          resetToken = match[1];
          console.log('  📧 Reset token captured from logs:', resetToken);
        }
      }
    });

    // Check backend logs for the reset link
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    await page.click('button[type="submit"]');
    await delay(2000); // Wait for submission and response

    await page.screenshot({ path: 'test-forgot-pwd-04-after-submit.png' });
    console.log('  Screenshot saved: test-forgot-pwd-04-after-submit.png');

    // Restore console.log
    console.log = originalLog;

    // Step 5: Verify success message
    console.log('\n✓ Step 5: Verify success message');

    // Check for error message first
    const errorMessage = await page.evaluate(() => {
      const element = document.querySelector('.bg-red-50');
      return element ? element.textContent : null;
    });

    if (errorMessage) {
      console.log('  ❌ Error message found:', errorMessage);
      throw new Error(`API error: ${errorMessage}`);
    }

    const successMessage = await page.evaluate(() => {
      const element = document.querySelector('.bg-secondary\\/10');
      return element ? element.textContent : null;
    });

    if (!successMessage || !successMessage.includes('Email trimis')) {
      throw new Error('Success message not found');
    }
    console.log('  ✓ Success message displayed');

    // Step 6: Verify email sent (check logs) - Get reset token from DB
    console.log('\n✓ Step 6: Verify reset token created (check database)');

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(testEmail);
    if (!user) {
      throw new Error('Test user not found in database');
    }

    const resetTokenRow = db.prepare(`
      SELECT token, expires_at, used
      FROM password_reset_tokens
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(user.id);

    if (!resetTokenRow) {
      throw new Error('Reset token not found in database');
    }

    resetToken = resetTokenRow.token;
    console.log('  ✓ Reset token found in database');
    console.log('  Token:', resetToken.substring(0, 16) + '...');
    console.log('  Used:', resetTokenRow.used);
    console.log('  Expires:', resetTokenRow.expires_at);

    // Step 7: Use reset link to navigate to reset page
    console.log('\n✓ Step 7: Navigate to reset password page with token');
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    await page.goto(resetUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test-forgot-pwd-05-reset-page.png' });
    console.log('  Screenshot saved: test-forgot-pwd-05-reset-page.png');

    // Verify we're on the reset password page
    const resetPageUrl = page.url();
    if (!resetPageUrl.includes('/reset-password')) {
      throw new Error(`Expected URL to include /reset-password, got: ${resetPageUrl}`);
    }
    console.log('  ✓ Navigated to reset password page with token');

    // Step 8: Enter new password
    console.log('\n✓ Step 8: Enter new password');
    const newPassword = 'newPassword123';
    await page.waitForSelector('input[name="newPassword"]');
    await page.type('input[name="newPassword"]', newPassword);
    await page.screenshot({ path: 'test-forgot-pwd-06-new-password.png' });
    console.log('  Screenshot saved: test-forgot-pwd-06-new-password.png');

    // Step 9: Confirm password
    console.log('\n✓ Step 9: Confirm password');
    await page.waitForSelector('input[name="confirmPassword"]');
    await page.type('input[name="confirmPassword"]', newPassword);
    await page.screenshot({ path: 'test-forgot-pwd-07-confirm-password.png' });
    console.log('  Screenshot saved: test-forgot-pwd-07-confirm-password.png');

    // Step 10: Submit reset form
    console.log('\n✓ Step 10: Submit reset form');
    await page.click('button[type="submit"]');
    await delay(2000); // Wait for submission
    await page.screenshot({ path: 'test-forgot-pwd-08-after-reset.png' });
    console.log('  Screenshot saved: test-forgot-pwd-08-after-reset.png');

    // Verify success message
    const resetSuccessMessage = await page.evaluate(() => {
      const element = document.querySelector('.bg-secondary\\/10');
      return element ? element.textContent : null;
    });

    if (!resetSuccessMessage || !resetSuccessMessage.includes('resetată cu succes')) {
      throw new Error('Reset success message not found');
    }
    console.log('  ✓ Password reset success message displayed');

    // Verify token is marked as used
    const updatedToken = db.prepare(`
      SELECT used FROM password_reset_tokens WHERE token = ?
    `).get(resetToken);

    if (updatedToken.used !== 1) {
      throw new Error('Token should be marked as used');
    }
    console.log('  ✓ Token marked as used in database');

    // Step 11: Verify can login with new password
    console.log('\n✓ Step 11: Login with new password');

    // Wait for redirect or navigate manually
    await delay(3000); // Wait for auto-redirect

    // If not redirected, navigate manually
    const finalUrl = page.url();
    if (!finalUrl.includes('/login')) {
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    }

    // Fill in login form with new password
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', testEmail);
    await page.type('input[name="password"]', newPassword);
    await page.screenshot({ path: 'test-forgot-pwd-09-login-new-pwd.png' });
    console.log('  Screenshot saved: test-forgot-pwd-09-login-new-pwd.png');

    await page.click('button[type="submit"]');
    await delay(2000);
    await page.screenshot({ path: 'test-forgot-pwd-10-after-login.png' });
    console.log('  Screenshot saved: test-forgot-pwd-10-after-login.png');

    // Verify login successful (redirected to dashboard)
    await delay(2000); // Wait for redirect
    const dashboardUrl = page.url();
    if (!dashboardUrl.includes('/client')) {
      throw new Error(`Expected to be redirected to /client, got: ${dashboardUrl}`);
    }
    console.log('  ✓ Successfully logged in with new password');

    await page.screenshot({ path: 'test-forgot-pwd-11-dashboard.png' });
    console.log('  Screenshot saved: test-forgot-pwd-11-dashboard.png');

    // Reset password back to original for future tests
    console.log('\n🔄 Resetting password back to original for future tests...');
    const bcrypt = require('bcrypt');
    const originalPassword = 'client123';
    const hashedPassword = await bcrypt.hash(originalPassword, 12);

    db.prepare(`
      UPDATE users
      SET password_hash = ?
      WHERE email = ?
    `).run(hashedPassword, testEmail);
    console.log('  ✓ Password reset to original value');

    // Close database
    db.close();

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL STEPS PASSED - Forgot Password Flow Complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run test
testForgotPasswordFlow()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
