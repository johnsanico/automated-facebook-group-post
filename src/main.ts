// main.ts
import 'dotenv/config';
import { launchBrowser } from './core/browser.js';
import { loadCookies } from './cookies/cookie-loader.js';
import { switchProfile } from './profiles/profile-switcher.js';
import { shareToGroup } from './posting/group-poster.js';
import {
  FACEBOOK_HOME_URL,
  TARGET_PROFILE_NAME,
  POSTING_TASKS,
} from './config/settings.js';

async function automateFacebookPosting(): Promise<void> {
  const { browser, context, page } = await launchBrowser();

  try {
    if (!(await loadCookies(context))) return;

    // Navigate to Facebook
    try {
      await page.goto(FACEBOOK_HOME_URL, { waitUntil: 'load', timeout: 40_000 });
      console.info('🏠 Facebook home page loaded successfully.');
    } catch (err) {
      console.error('❌ Failed to load Facebook home page:', err);
    }

    await switchProfile(page, TARGET_PROFILE_NAME);

    const results: string[] = [];
    for (const task of POSTING_TASKS) {
      for (const groupName of task.groups) {
        const success = await shareToGroup(page, task.source_url, groupName, task.message);
        results.push(`${groupName}: ${success ? '✅ SUCCESS' : '❌ FAILURE'}`);
        await new Promise(resolve => setTimeout(resolve, 5_000));
      }
    }

    console.info('\n===============================');
    console.info('🎯 AUTOMATION COMPLETE');
    console.info('===============================');
    for (const result of results) {
      console.info(result);
    }
  } finally {
    await browser.close();
  }
}

automateFacebookPosting().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});