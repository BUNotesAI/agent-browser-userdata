export const stealthScripts = [
  // 1. Remove navigator.webdriver - CRITICAL for passing bot detection
  `
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  `,

  // 2. Mock window.chrome (enhanced with more realistic properties)
  `
    if (!window.chrome) {
      window.chrome = {
        runtime: {
          onConnect: { addListener: () => {} },
          onMessage: { addListener: () => {} },
        },
        loadTimes: () => ({}),
        csi: () => ({}),
      };
    }
  `,

  // 3. Remove CDP traces (cdc_ properties from Chrome DevTools)
  `
    for (const key of Object.keys(window)) {
      if (key.startsWith('cdc_') || key.startsWith('$cdc_')) {
        delete window[key];
      }
    }
  `,

  // 4. Fix navigator.plugins (Chrome-specific plugins)
  `
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        const plugins = [
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' },
        ];
        plugins.item = (i) => plugins[i];
        plugins.namedItem = (n) => plugins.find(p => p.name === n);
        plugins.refresh = () => {};
        return plugins;
      },
    });
  `,

  // 5. Fix navigator.languages
  `
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  `,

  // 6. Remove Playwright/Patchright traces
  `
    for (const key of Object.keys(window)) {
      if (key.includes('playwright') || key.includes('Playwright')) {
        try { delete window[key]; } catch {}
      }
    }
  `,

  // 7. Mock Permissions API (enhanced)
  `
    const originalQuery = navigator.permissions?.query;
    if (navigator.permissions) {
      navigator.permissions.query = (params) => {
        if (params.name === 'notifications') {
          return Promise.resolve({ state: 'prompt', onchange: null });
        }
        return originalQuery ? originalQuery.call(navigator.permissions, params)
          : Promise.resolve({ state: 'granted' });
      };
    }
  `,

  // 8. Fix WebGL Vendor/Renderer
  `
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(param) {
      if (param === 37445) return 'Intel Inc.';  // UNMASKED_VENDOR_WEBGL
      if (param === 37446) return 'Intel Iris OpenGL Engine';  // UNMASKED_RENDERER_WEBGL
      return getParameter.call(this, param);
    };
  `,
];
