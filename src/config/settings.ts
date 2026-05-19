// config/settings.ts
import type { PostingTask } from '../types.js';  // verbatimModuleSyntax requires `import type`

export const COOKIE_FILE = 'facebookcookies.json';
export const FACEBOOK_HOME_URL = 'https://www.facebook.com/';

// These can come from process.env (loaded by dotenv)
export const TARGET_PROFILE_NAME = process.env.TARGET_PROFILE_NAME || '';
export const GROUP_POST_MESSAGE = process.env.GROUP_POST_MESSAGE;

export const POSTING_TASKS: PostingTask[] = [
  {
    source_url: 'https://www.facebook.com/share/1CaZmrysPA/',
    groups: [
      'Central Signal Taguig Buy n Sell',
      'North Signal Vill. EXCHANGE',
    ],
    message: `[Bossink LPG] - ${GROUP_POST_MESSAGE}`,
  },
];