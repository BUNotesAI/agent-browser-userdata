export const stealthScripts = [
  // 1. Remove navigator.webdriver - CRITICAL for passing bot detection
  `
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  `,
  // 2. Mock window.chrome (if missing or incomplete)
  `
    if (!window.chrome) {
      window.chrome = {};
    }
    if (!window.chrome.runtime) {
      window.chrome.runtime = {};
    }
  `,
  // 3. Mock Permissions (pass-through 'granted' to avoid queries revealing automation)
  `
    if (!window.navigator.permissions) {
      window.navigator.permissions = {};
    }
    if (!window.navigator.permissions.query) {
       window.navigator.permissions.query = (parameters) => Promise.resolve({ state: 'granted' });
    }
  `,
];
