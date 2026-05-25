# Provider Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `providers.grassrootslabs.com` redirects without changing Altrua or Medi-Share behavior.

**Architecture:** Use Netlify `_redirects` as the active source for Providers because `_redirects` runs before `netlify.toml`. Add full-domain provider rules at the top so they match before the existing Altrua wildcard. Remove the old broken Providers `_redirects` section and the duplicate Providers `netlify.toml` blocks so Providers has one clear source of truth.

**Tech Stack:** Netlify static redirects, `_redirects`, `netlify.toml`, Node `fetch` for live verification.

---

### Task 1: Add a Provider Redirect Verification Script

**Files:**
- Create: `scripts/verify-provider-redirects.mjs`

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-provider-redirects.mjs` with:

```javascript
const checks = [
  {
    url: "https://providers.grassrootslabs.com/sq2",
    status: 301,
    location: "https://www.grassrootslabs.com/sq2-members",
  },
  {
    url: "https://providers.grassrootslabs.com/birthingwaymidwifery",
    status: 301,
    location: "https://www.grassrootslabs.com/birthing-way-midwifery",
  },
  {
    url: "https://providers.grassrootslabs.com/seacoastwholehealth",
    status: 301,
    location: "https://www.grassrootslabs.com/seacoast-members",
  },
  {
    url: "https://providers.grassrootslabs.com/tnawc",
    status: 301,
    location: "https://www.grassrootslabs.com/tnawc",
  },
  {
    url: "https://providers.grassrootslabs.com/",
    status: 302,
    location: "https://www.grassrootslabs.com/providers",
  },
  {
    url: "https://providers.grassrootslabs.com/unknown-provider-path",
    status: 302,
    location: "https://www.grassrootslabs.com/providers",
  },
];

let failures = 0;

for (const check of checks) {
  const response = await fetch(check.url, {
    method: "HEAD",
    redirect: "manual",
  });

  const actualLocation = response.headers.get("location") || "";
  const passed =
    response.status === check.status && actualLocation === check.location;

  if (!passed) {
    failures += 1;
    console.error(
      [
        `FAIL ${check.url}`,
        `  expected: ${check.status} ${check.location}`,
        `  actual:   ${response.status} ${actualLocation}`,
      ].join("\n")
    );
  } else {
    console.log(`PASS ${check.url}`);
  }
}

if (failures > 0) {
  process.exit(1);
}
```

- [ ] **Step 2: Run it to verify current production fails**

Run: `node scripts/verify-provider-redirects.mjs`

Expected: FAIL because provider URLs currently redirect to the Altrua destination or return `200`.

### Task 2: Update Provider Redirect Rules

**Files:**
- Modify: `public/_redirects`
- Modify: `netlify.toml`

- [ ] **Step 1: Put full-domain Provider rules first in `_redirects`**

Add this block at the top of `public/_redirects`:

```text
# Provider Office redirects
https://providers.grassrootslabs.com/sq2                  https://www.grassrootslabs.com/sq2-members                  301!
https://providers.grassrootslabs.com/birthingwaymidwifery https://www.grassrootslabs.com/birthing-way-midwifery       301!
https://providers.grassrootslabs.com/seacoastwholehealth  https://www.grassrootslabs.com/seacoast-members             301!
https://providers.grassrootslabs.com/tnawc                https://www.grassrootslabs.com/tnawc                        301!
https://providers.grassrootslabs.com/                     https://www.grassrootslabs.com/providers                    302!
https://providers.grassrootslabs.com/*                    https://www.grassrootslabs.com/providers                    302!
```

- [ ] **Step 2: Remove the old Providers section from `_redirects`**

Remove the section starting with `# Provider Office redirects (top, specific first)` through its `Host=providers.grassrootslabs.com` wildcard line. Leave Altrua and Medi-Share sections unchanged.

- [ ] **Step 3: Remove duplicate Providers blocks from `netlify.toml`**

Remove only the two `[[redirects]]` blocks under `# Providers`. Leave Altrua, Medi-Share, and the final fallback unchanged.

### Task 3: Verify and Push

**Files:**
- Read: `public/_redirects`
- Read: `netlify.toml`

- [ ] **Step 1: Review the diff**

Run: `git diff -- public/_redirects netlify.toml scripts/verify-provider-redirects.mjs docs/superpowers/plans/2026-05-25-provider-redirects.md`

Expected: only Provider redirect work plus the plan and verification script.

- [ ] **Step 2: Commit and push**

Run:

```bash
git add public/_redirects netlify.toml scripts/verify-provider-redirects.mjs docs/superpowers/plans/2026-05-25-provider-redirects.md
git commit -m "fix: correct provider redirects"
git push origin main
```

Expected: push succeeds.

- [ ] **Step 3: Verify live behavior after Netlify deploys**

Run: `node scripts/verify-provider-redirects.mjs`

Expected: all six checks print `PASS`.

### Self-Review

- Spec coverage: Covers the four confirmed provider-specific paths, the confirmed Providers root destination, and wildcard fallback.
- Placeholder scan: No placeholders remain.
- Scope check: Does not modify Medi-Share and does not change intended Altrua destinations.
