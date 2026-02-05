import { describe, it, expect, afterEach, beforeAll, afterAll } from 'vitest';
import { BrowserManager } from '../src/browser.js';
import { writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('File Access (Issue #345)', () => {
  let browser: BrowserManager;
  const testFilePath = path.join(os.tmpdir(), 'agent-browser-test-file.html');
  const testFileUrl = `file://${testFilePath}`;

  // Create test HTML file before tests
  beforeAll(() => {
    writeFileSync(
      testFilePath,
      '<html><body><h1>Test File Access</h1><p>This content was loaded from a local file.</p></body></html>'
    );
  });

  // Clean up test file after tests
  afterAll(() => {
    try {
      unlinkSync(testFilePath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  afterEach(async () => {
    if (browser?.isLaunched()) {
      await browser.close();
    }
  });

  describe('file:// URL navigation', () => {
    it('should navigate to file:// URL', async () => {
      browser = new BrowserManager();
      await browser.launch({
        headless: true,
      });

      const page = browser.getPage();

      // Navigate to file:// URL
      await page.goto(testFileUrl);

      // The page should load
      const url = page.url();
      expect(url).toBe(testFileUrl);

      // Content should be accessible when navigating directly
      const content = await page.content();
      expect(content).toContain('Test File Access');
    });
  });

  // Note: allowFileAccess launch option is an upstream feature not yet merged into this fork.
  // These tests are skipped until that feature is added.

  describe.skip('with allowFileAccess flag (upstream feature)', () => {
    it('should load file:// URL with allowFileAccess enabled', async () => {
      // Requires upstream allowFileAccess launch option
    });

    it('should allow file:// URL to access other local files via XMLHttpRequest', async () => {
      // Requires upstream allowFileAccess launch option
    });
  });

  describe.skip('combined with other options (upstream feature)', () => {
    it('should work with allowFileAccess and custom user-agent', async () => {
      // Requires upstream allowFileAccess and userAgent launch options
    });

    it('should work with allowFileAccess and custom args', async () => {
      // Requires upstream allowFileAccess and args launch options
    });
  });
});
