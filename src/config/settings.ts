// src/config/settings.ts
import type { PostingTask } from '../types.js';

export const FACEBOOK_HOME_URL = 'https://www.facebook.com/';

export const TARGET_PROFILE_NAME = process.env.TARGET_PROFILE_NAME || 'Ian Estrella';
export const GROUP_POST_MESSAGE = process.env.GROUP_POST_MESSAGE || '@Everyone';

// Build posting tasks from environment variables (keeps sensitive data out of source)
function buildPostingTasks(): PostingTask[] {
  const sourceUrl = process.env.SOURCE_URL;
  const groupListRaw = process.env.GROUP_LIST;

  if (!sourceUrl || !groupListRaw) {
    console.error('❌ SOURCE_URL and GROUP_LIST must be set in .env');
    process.exit(1);
  }

  const groups = groupListRaw.split(',').map(g => g.trim()).filter(g => g.length > 0);
  if (groups.length === 0) {
    console.error('❌ GROUP_LIST must contain at least one group name');
    process.exit(1);
  }

  return [
    {
      source_url: sourceUrl,
      groups,
      message: `[Bossink LPG] - ${GROUP_POST_MESSAGE}`,
    },
  ];
}

export const POSTING_TASKS: PostingTask[] = buildPostingTasks();