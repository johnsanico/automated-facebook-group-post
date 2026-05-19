import 'dotenv/config';
import { chromium, type BrowserContext, type Page } from 'playwright';
import path from 'node:path';
import * as readline from 'node:readline';

async function saveFacebookSession(): Promise<void> {
    // Determine the save path from .env or use a default
    const sessionPath = process.env.FACEBOOK_SESSION_PATH || './facebookCookies.json';
    
    // Path for the temporary browser profile
    const userDataDir = path.join(process.cwd(), 'chrome_data');

    const context: BrowserContext = await chromium.launchPersistentContext(userDataDir, {
        channel: 'chrome',
        headless: false,
    });

    const page: Page = await context.newPage();
    
    try {
        await page.goto('https://www.facebook.com');

        console.log('🔑 Please log in to Facebook manually in the opened Chrome window.');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        await new Promise<void>((resolve) => {
            rl.question('✅ Press ENTER here after you are fully logged in...', () => {
                rl.close();
                resolve();
            });
        });

        // Save session data to the path defined in your .env
        await context.storageState({ path: sessionPath });

        console.log(`💾 Session successfully saved to: ${sessionPath}`);

    } catch (error) {
        console.error('❌ Error saving session:', error);
    } finally {
        await context.close();
        process.exit();
    }
}

saveFacebookSession();