# Grassroots Labs Redirect Service

This repository manages Netlify-hosted redirects for Grassroots Labs landing-page subdomains.

The deployed site is intentionally minimal. Netlify reads `public/_redirects` first, then `netlify.toml`. Redirect rules in `public/_redirects` are the source of truth for subdomain redirects. `netlify.toml` only contains the final static fallback to `public/index.html`.

## How It Works

Each managed subdomain should point to the Netlify redirects site:

```text
<subdomain>.grassrootslabs.com CNAME grassrootslabs.netlify.app
```

Redirect rules use explicit full-domain sources:

```text
https://subdomain.grassrootslabs.com/path https://www.grassrootslabs.com/target 301!
```

The trailing `!` forces the redirect to win over static files such as `public/index.html`. This matters for root paths like `/`, which would otherwise serve the static index page instead of redirecting.

## Current Redirect Groups

### Impact Health

```text
https://impacthealthsharing.grassrootslabs.com/
-> 302 https://www.grassrootslabs.com/impact-health-members

https://impacthealthsharing.grassrootslabs.com/*
-> 302 https://www.grassrootslabs.com/impact-health-members
```

### Altrua

```text
https://altrua.grassrootslabs.com/members
-> 301 https://www.grassrootslabs.com/ahs-members

https://altrua.grassrootslabs.com/enrollment
-> 301 https://www.grassrootslabs.com/ahs-enrollment

https://altrua.grassrootslabs.com/providers
-> 301 https://www.grassrootslabs.com/altrua-providers

https://altrua.grassrootslabs.com/
-> 302 https://www.grassrootslabs.com/ahs-members

https://altrua.grassrootslabs.com/*
-> 302 https://www.grassrootslabs.com/ahs-members
```

### Provider Offices

```text
https://providers.grassrootslabs.com/sq2
-> 301 https://www.grassrootslabs.com/sq2-members

https://providers.grassrootslabs.com/birthingwaymidwifery
-> 301 https://www.grassrootslabs.com/birthing-way-midwifery

https://providers.grassrootslabs.com/seacoastwholehealth
-> 301 https://www.grassrootslabs.com/seacoast-members

https://providers.grassrootslabs.com/tnawc
-> 301 https://www.grassrootslabs.com/tnawc

https://providers.grassrootslabs.com/
-> 302 https://www.grassrootslabs.com/providers

https://providers.grassrootslabs.com/*
-> 302 https://www.grassrootslabs.com/providers
```

### Medi-Share

```text
https://medi-share.grassrootslabs.com/members
-> 301 https://www.grassrootslabs.com/medi-share-members

https://medi-share.grassrootslabs.com/hpp
-> 301 https://www.grassrootslabs.com/medi-share-health-partnership

https://medi-share.grassrootslabs.com/
-> 302 https://www.grassrootslabs.com/medi-share-members

https://medi-share.grassrootslabs.com/*
-> 302 https://www.grassrootslabs.com/medi-share-members
```

## Making Changes

1. Add new rules to `public/_redirects`.
2. Put specific paths before wildcard rules.
3. Use explicit full-domain sources for subdomain rules.
4. Use `301!` for permanent path redirects.
5. Use `302!` for root or wildcard campaign redirects unless the destination is confirmed permanent.
6. Keep the `/*` fallback in `netlify.toml` last and do not add subdomain-specific rules there.
7. If adding a new subdomain, confirm DNS points to `grassrootslabs.netlify.app` and Netlify has provisioned HTTPS for the hostname.

## Verification

Run the relevant script after deploy:

```powershell
node scripts/verify-altrua-redirects.mjs
node scripts/verify-provider-redirects.mjs
node scripts/verify-medi-share-redirects.mjs
node scripts/verify-impact-health-redirects.mjs
```

Run all checks:

```powershell
node scripts/verify-altrua-redirects.mjs
node scripts/verify-provider-redirects.mjs
node scripts/verify-medi-share-redirects.mjs
node scripts/verify-impact-health-redirects.mjs
```

If a newly pointed subdomain fails with a TLS certificate error, check the Netlify site domain settings and renew or provision the certificate for that hostname.

## Notes

- `public/index.html` is only a fallback page for unmatched requests.
- `gcm-diagnose.log` is a local Git Credential Manager diagnostic artifact and should not be committed.
- Git pushes to `main` trigger Netlify deployment.
