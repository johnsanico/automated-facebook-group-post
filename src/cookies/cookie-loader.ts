// cookies/cookie-loader.ts
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { BrowserContext } from 'playwright';   // only the type
import type { Cookie } from '../types.js';
import { COOKIE_FILE } from '../config/settings.js';

export async function loadCookies(context: BrowserContext): Promise<boolean> {
  if (!existsSync(COOKIE_FILE)) {
    console.error(`❌ Error: Cookie file '${COOKIE_FILE}' not found.`);
    console.info('➡️  Please ensure you are logged in and have saved your cookies.');
    return false;
  }

  try {
    const raw = await readFile(COOKIE_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    // It must be a non‑null object
    if (typeof parsed !== 'object' || parsed === null) {
      console.error('❌ Invalid cookie format: Expected an object or array.');
      return false;
    }

    // Now treat it as a dictionary for easy property access
    const cookieObj = parsed as Record<string, unknown>;
    let cookies: unknown[];

    // If it already looks like an array, use it directly
    if (Array.isArray(parsed)) {
      cookies = parsed;
    }
    // If there's a "cookies" wrapper property, use that
    else if ('cookies' in cookieObj && Array.isArray(cookieObj.cookies)) {
      cookies = cookieObj.cookies;
    }
    // Otherwise, assume it's a flat object of { name: value } (e.g., { c_user: "...", xs: "..." })
    else {
      cookies = Object.entries(cookieObj).map(([name, value]) => ({
        name,
        value,
        domain: '.facebook.com',
        path: '/',
      }));
    }

    // Map each item to the minimal shape Playwright needs
    const cookieList: Cookie[] = cookies.map((c: any) => ({
      name: c.name,
      value: c.value,
      domain: c.domain ?? '.facebook.com',
      path: c.path ?? '/',
    }));

    await context.addCookies(cookieList);
    console.info('🍪 Cookies loaded successfully into browser context.');
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error loading cookies: ${message}`);
    return false;
  }
} 