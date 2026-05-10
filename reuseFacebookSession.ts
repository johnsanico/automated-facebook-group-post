import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as readline from 'node:readline';
import 'dotenv/config';

async function reuseFacebookSession(): Promise<void> {
    // Read the session path from your .env file
    const sessionPath = process.env.FACEBOOK_SESSION_PATH;

    if (!sessionPath) {
        console.error('❌ Error: FACEBOOK_SESSION_PATH is not defined in your .env file.');
        process.exit(1);
    }
    // 1. Launch the browser (Real Google Chrome)
    const browser: Browser = await chromium.launch({
        channel: 'chrome',
        headless: false, // Set to true if you want it to run in the background later
    });

    try {
        // 2. Create a new context while LOADING the storage state
        console.log('⏳ Loading saved session:', sessionPath);
        const context: BrowserContext = await browser.newContext({
            storageState: sessionPath,
        });

        // 3. Open a page and go to Facebook
        const page: Page = await context.newPage();
        await page.goto('https://www.facebook.com');

        console.log('✅ Logged in automatically using saved session!');

        // 4. Keep the browser open until you press ENTER
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
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