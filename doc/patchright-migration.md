# Patchright Migration Design

## Summary
This document proposes a full refactor of agent-browser to depend on Patchright instead of Playwright while preserving the current system Chrome + headed login flow that uses a persistent context.

Patchright is a drop-in replacement for Playwright, but it only supports Chromium-based browsers and it disables the Console API to avoid detection. This affects browser selection and console log features.

## Goals
- Replace Playwright dependencies with Patchright equivalents.
- Keep the existing system Chrome + headed login flow (channel + persistent context).
- Maintain API behavior for core navigation and interaction commands.
- Clearly define degraded or unsupported features under Patchright (console, non-Chromium browsers).

## Non-goals
- Support Firefox or WebKit after the migration (not supported by Patchright).
- Provide perfect parity with Playwright console logging (disabled in Patchright).

## Constraints and Key Differences
- Patchright only patches Chromium-based browsers. Firefox and WebKit are not supported.
- Patchright disables the Console API, so console event tracking will not work.
- Patchright recommends using system Chrome with `launchPersistentContext` and `channel: "chrome"`, and recommends not adding custom headers or userAgent for best stealth.
- Patchright is distributed via the `patchright` npm package and uses `npx patchright install chromium` for browser install.

## Proposed Design

### 1) Dependency and Runtime Strategy
- Replace runtime dependency `playwright-core` with `patchright-core`.
- Replace dev dependency `playwright` with `patchright` to keep a CLI installer available for postinstall or docs.
- Update any install instructions to use `npx patchright install chromium` (or `chrome` if desired).

Rationale: `patchright-core` mirrors the no-browser flavor of Playwright, matching the current architecture that relies on a separate install step.

### 2) Browser Selection and Types
- Remove `firefox` and `webkit` imports and branching.
- Update all types and protocol schemas to only allow `chromium`.
- Update CLI validation to reject `firefox`/`webkit` with a clear error message.

User-facing change:
- `--browser` (if exposed) should accept only `chromium`. Any other value returns a structured error.

### 3) Console API Behavior
- `page.on('console')` event tracking will not emit under Patchright.
- Keep the `console` command but return an empty list and add a message that console logs are unavailable under Patchright.
- Add a short warning to README and CLI help for `console`.

Optional alternative (not default):
- Provide an opt-in init script that wraps `console.*` in the page to forward logs to `window.__agentBrowserLogs`, which can be pulled via `evaluate`. This should be documented as less stealthy and potentially detectable.

### 4) Launch Defaults and Stealth Posture
- Preserve current `launchPersistentContext` flow and `channel: "chrome"` usage, which aligns with Patchright best practices.
- Do not change default `headless` or `viewport` behavior unless explicitly required; keep existing user-facing options.
- Add documentation note: custom headers or userAgent may reduce stealth under Patchright.

### 5) Install and Postinstall Flow
- Replace Playwright install hints in `scripts/postinstall.js`, README, and CLI native installer strings with Patchright equivalents.
- Example:
  - Old: `npx playwright install chromium`
  - New: `npx patchright install chromium`

### 6) Tests and CI
- Update tests that mention Playwright-specific browser choices.
- If any tests assert console output, adjust expectations for Patchright mode.
- Add a simple smoke test that launches chromium via Patchright and opens a page.

## Migration Steps (Implementation Plan)
1. Dependencies
   - Update `package.json` dependencies: replace `playwright-core` -> `patchright-core` and `playwright` -> `patchright`.
2. Core imports and types
   - Update imports in `src/browser.ts`, `src/actions.ts`, `src/snapshot.ts`, `src/types.ts`.
   - Remove non-Chromium branches and types.
3. Protocol and validation
   - Update `src/protocol.ts` schemas for browser enum.
4. Console command behavior
   - Keep `console` endpoint but return empty list + warning string.
5. Documentation and CLI output
   - Update README install steps and CLI help strings.
6. Tests
   - Adjust or add tests for chromium-only and console unavailability.

## Compatibility Notes
- Current system Chrome login flow is preserved because Patchright explicitly recommends `launchPersistentContext` with `channel: "chrome"`.
- Features dependent on console events will degrade.
- Non-Chromium browsers are no longer supported.

## Risks and Mitigations
- Version skew vs Playwright: Patchright versions may lag or diverge.
  - Mitigation: track Patchright release notes and pin versions; add a compatibility smoke test in CI.
- Console observability loss.
  - Mitigation: document as unsupported; provide opt-in JS logger in debug mode.
- Changes to stealth behavior if users set headers or userAgent.
  - Mitigation: warn in docs and avoid setting headers by default under Patchright.

## Acceptance Criteria
- agent-browser builds and runs with Patchright dependencies.
- Chromium launches via Patchright with current channel + persistent context flow.
- All core commands (navigate, click, type, snapshot, wait, etc.) work as before.
- Console command returns a clear message that console logs are unavailable under Patchright.
- Non-Chromium options are rejected with a clear error.

## Open Questions
- Do we want to keep a dual-mode build (Playwright vs Patchright) for fallback?
- Should we disable custom headers in Patchright mode by default or keep current behavior with warnings?
