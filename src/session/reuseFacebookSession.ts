// src/session/reuseFacebookSession.ts
// Demo script that loads a saved session and opens Facebook.
// Not used by the main automation – just for testing the session file.
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as readline from 'node:readline';
import 'dotenv/config';

async function reuseFacebookSession(): Promise<void> {
  const sessionPath = process.env.FACEBOOK_SESSION_PATH;

  if (!sessionPath) {
    console.error('❌ Error: FACEBOOK_SESSION_PATH is not defined in your .env file.');
    process.exit(1);
  }

  const browser: Browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
  });

  try {
    console.log('⏳ Loading saved session:', sessionPath);
    const context: BrowserContext = await browser.newContext({
      storageState: sessionPath,
    });

    const page: Page = await context.newPage();
    await page.goto('https://www.facebook.com');

    console.log('✅ Logged in automatically using saved session!');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise<void>((resolve) => {
      rl.question('🚀 Automation ready. Press ENTER to close the browser...', () => {
        rl.close();
        resolve();
      });
    });
  } catch (error) {
    console.error('❌ Failed to reuse session. Make sure the .json file exists and is valid.');
    console.error(error);
  } finally {
    await browser.close();
    process.exit();
  }
}

reuseFacebookSession();