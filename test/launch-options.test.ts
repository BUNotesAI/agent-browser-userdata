import { describe, it, expect, afterEach } from 'vitest';
import { BrowserManager } from '../src/browser.js';

describe('Launch Options', () => {
  let browser: BrowserManager;

  afterEach(async () => {
    if (browser?.isLaunched()) {
      await browser.close();
    }
  });

  describe('browser args', () => {
    // Note: With patchright, webdriver detection is disabled by default
    // These tests verify our anti-detection features work correctly

    it('should launch with default anti-detection features', async () => {
      browser = new BrowserManager();
      await browser.launch({
        headless: true,
      });

      const page = browser.getPage();
      await page.goto('about:blank');

      // With patchright, webdriver is false by default (anti-detection)
      const webdriver = await page.evaluate(() => navigator.webdriver);
      expect(webdriver).toBe(false);
    });

    it('should launch successfully', async () => {
      browser = new BrowserManager();
      await browser.launch({
        headless: true,
      });

      expect(browser.isLaunched()).toBe(true);
    });
  });

  // Note: userAgent, proxy, args, and allowFileAccess options are upstream features
  // not yet merged into this fork. Skipping these tests until those features are added.

  describe.skip('custom user-agent (upstream feature)', () => {
    it('should launch with custom user-agent', async () => {
      // Requires upstream userAgent launch option
    });

    it('should use default user-agent when not specified', async () => {
      // Requires upstream userAgent launch option
    });
  });

  describe.skip('proxy configuration (upstream feature)', () => {
    it('should accept proxy configuration', async () => {
      // Requires upstream proxy launch option
    });

    it('should accept proxy with bypass list', async () => {
      // Requires upstream proxy launch option
    });

    it('should fail connection when proxy is unreachable', async () => {
      // Requires upstream proxy launch option
    });
  });

  describe.skip('combined options (upstream feature)', () => {
    it('should launch with args, user-agent, and proxy combined', async () => {
      // Requires upstream launch options
    });
  });
});
