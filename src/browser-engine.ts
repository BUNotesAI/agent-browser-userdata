/**
 * Browser Engine Abstraction Layer
 *
 * Centralizes all patchright-core imports to minimize merge conflicts
 * with upstream (which uses playwright-core).
 *
 * Benefits:
 * - Future upstream merges only conflict in this single file
 * - Easy to switch between patchright/playwright by changing imports here
 * - Clear separation of browser engine dependency
 */

export {
  chromium,
  devices,
  type Browser,
  type BrowserContext,
  type Page,
  type Frame,
  type Dialog,
  type Request,
  type Route,
  type Locator,
  type CDPSession,
} from 'patchright-core';
