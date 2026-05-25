# Altrua Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `altrua.grassrootslabs.com` root redirect while preserving the working Altrua path redirects.

**Architecture:** Keep Netlify `_redirects` as the active source of truth for host-specific redirects. Replace the broken multiline `Host=` Altrua section with explicit full-domain rules and force the root redirect so `public/index.html` cannot shadow it. Remove duplicate Altrua fallback blocks from `netlify.toml`.

**Tech Stack:** Netlify static redirects, `_redirects`, `netlify.toml`, Node `fetch` for live verification.

---

### Task 1: Verify Current Altrua Behavior

- [ ] Add `scripts/verify-altrua-redirects.mjs` covering `/members`, `/enrollment`, `/providers`, `/`, and an unknown path.
- [ ] Run `node scripts/verify-altrua-redirects.mjs`.
- [ ] Confirm current production fails on `/` with `200` instead of `302 https://www.grassrootslabs.com/ahs-members`.

### Task 2: Update Altrua Rules

- [ ] Add explicit full-domain Altrua rules at the top of `public/_redirects`.
- [ ] Remove the old path-only Altrua section with standalone `Host=altrua.grassrootslabs.com` lines.
- [ ] Remove duplicate Altrua fallback rules from `netlify.toml`.

### Task 3: Verify and Push

- [ ] Review `git diff -- public/_redirects netlify.toml scripts/verify-altrua-redirects.mjs scripts/verify-provider-redirects.mjs`.
- [ ] Run `node scripts/verify-provider-redirects.mjs` to confirm Providers stayed green before deploy.
- [ ] Commit and push the Altrua changes.
- [ ] Run `node scripts/verify-altrua-redirects.mjs` after Netlify deploys.

### Self-Review

- Scope: Altrua only, with a small verification-script exit-code cleanup shared with the Providers script.
- Confirmed destination: Altrua root and wildcard fallback go to `https://www.grassrootslabs.com/ahs-members`.
- Medi-Share remains untouched.
