# Kulturne Koncepty

Website for [Kultúrne Koncepty](https://kulturnekoncepty.sk) — built with Next.js 16+ (App Router), Sanity CMS, and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16+** (App Router) — static export for GitHub Pages
- **Sanity** — CMS for content
- **next-intl** — Slovak / English i18n via `[locale]` URL segment
- **next-sitemap** — sitemap generation at build time
- **SCSS Modules** — component-scoped styling

---

## Deploying to GitHub Pages

GitHub Pages is a **static host** — no Node.js server. This means:

- Server Components can only fetch at build time
- `revalidate` (ISR) → not supported
- API routes → not supported
- Dynamic rendering → not supported
- `images.remotePatterns` → replace with `images.unoptimized: true`

### `next.config.ts`

Do NOT use `static_site_generator: next` in the workflow — it generates a CommonJS `next.config.js` which breaks if `package.json` has `"type": "module"`.

Configure static export for GitHub Pages using a `GITHUB_PAGES` env variable. The config is wrapped with `createNextIntlPlugin`:

```ts
import createNextIntlPlugin from 'next-intl/plugin'
import type {NextConfig} from 'next'

const withNextIntl = createNextIntlPlugin('./localization/request.ts')

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
    ...(isGithubPages && {
        output: 'export',
        // basePath: '/your-repo-name',  // add if NOT using a custom domain
        images: {
            unoptimized: true,
        },
    }),
    ...(!isGithubPages && {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'cdn.sanity.io',
                },
            ],
        },
    }),
}

export default withNextIntl(nextConfig)
```

> **basePath** — read this before deploying:
> - Set it **only** when the site is served from a subpath, i.e. `username.github.io/repo-name` (no custom domain). Value = `'/repo-name'`.
> - **With a custom domain served from the root (our case, `kulturnekoncepty.sk`), `basePath` MUST be unset.** A leftover `basePath` prefixes every asset (`/repo-name/_next/...`), which then 404s on the root domain → **the page loads with no CSS/JS** (unstyled HTML, "broken" look). This is exactly the bug we hit — see the Pitfalls table.
> - Rule of thumb: `basePath` and a root custom domain are mutually exclusive. Switching to a custom domain? Remove `basePath` in the same change.

### i18n: `[locale]` URL segment with next-intl

**Directory structure:**

```
app/
  layout.tsx              ← root layout (metadata, returns children)
  page.tsx                ← root redirect / → /sk (for GitHub Pages)
  [locale]/
    layout.tsx            ← locale layout (next-intl provider, SEO)
    page.tsx              ← home page
localization/
  routing.ts              ← locale definitions (sk, en)
  request.ts              ← server-side request config
  navigation.ts           ← next-intl navigation helpers (Link, usePathname)
  messages/
    sk.json               ← Slovak translations
    en.json               ← English translations
proxy.ts                  ← next-intl middleware (locale detection, redirects)
```

**Routing config (`localization/routing.ts`):**

```ts
import {defineRouting} from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    localeDetection: false,
})
```

> **`localeDetection: false`**: Disables automatic locale detection from the browser's `Accept-Language` header. Without this, visiting `/` would redirect to `/en` for English-speaking users instead of the default `/sk`.

**Request config (`localization/request.ts`):**

```ts
import {getRequestConfig} from 'next-intl/server'
import {routing} from './routing'

export default getRequestConfig(async ({requestLocale}) => {
    let locale = await requestLocale

    if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
        locale = routing.defaultLocale
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    }
})
```

**Navigation helpers (`localization/navigation.ts`):**

```ts
import {createNavigation} from 'next-intl/navigation'
import {routing} from './routing'

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing)
```

**Proxy (`proxy.ts`):**

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The file must be named `proxy.ts`, otherwise locale routing breaks silently — the proxy won't run, `requestLocale` will always be `undefined`, and every page will render in the default locale.

```ts
import createMiddleware from 'next-intl/middleware'
import {routing} from './localization/routing'

export default createMiddleware(routing)

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

### `force-static` and explicit locale passing

The locale layout uses `export const dynamic = 'force-static'` for GitHub Pages compatibility. This blocks `headers()`, which next-intl uses internally to resolve the locale. To work around this, two things are needed:

1. **Call `setRequestLocale(locale)`** at the top of every layout and page inside `[locale]` — this tells next-intl's server-side functions (`useTranslations`, `getMessages`, etc.) which locale to use, without relying on `headers()`
2. **Pass locale explicitly** from URL params to `getMessages({locale})`, `getTranslations({locale, namespace})`, and `<NextIntlClientProvider locale={locale}>`

**Locale layout (`app/[locale]/layout.tsx`):**

```tsx
import {getMessages, setRequestLocale} from 'next-intl/server'

export const dynamic = 'force-static'

export function generateStaticParams() {
    return routing.locales.map(locale => ({locale}))
}

export default async function LocaleLayout({children, params}) {
    const {locale} = await params
    setRequestLocale(locale)
    const messages = await getMessages({locale})
    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
```

**Pages (`app/[locale]/page.tsx`):**

```tsx
import {getTranslations, setRequestLocale} from 'next-intl/server'

export default async function Home({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params
    setRequestLocale(locale)
    const data = await sanityFetch({query: homepageQuery, params: {locale}})
    const t = await getTranslations({locale, namespace: 'Sections'})
    // ...
}
```

> **`setRequestLocale`** is essential for server components that use `useTranslations` (without `'use client'`). Without it, those components always render in the default locale (`sk`) because `force-static` prevents `headers()` from resolving the locale.

> **Do NOT use `getLocale()`** from `next-intl/server` in server components with `force-static`. It calls `headers()` internally and will always return the default locale. Use `params.locale` instead.

**Client components** — `useLocale()` from `next-intl` works correctly because `NextIntlClientProvider` receives `locale={locale}` explicitly:

```tsx
'use client'
import {useLocale} from 'next-intl'

export function Component() {
    const locale = useLocale() // 'sk' or 'en' — works correctly
}
```

**Locale switcher:**

```tsx
'use client'
import {useLocale} from 'next-intl'
import {usePathname, Link} from '@/localization/navigation'

export function LocaleSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const otherLocale = locale === 'sk' ? 'en' : 'sk'

    return (
        <Link href={pathname} locale={otherLocale}>
            {otherLocale.toUpperCase()}
        </Link>
    )
}
```

### Root redirect (`app/page.tsx`)

On GitHub Pages, the proxy doesn't run (no server). Visiting `/` would return 404. This page provides a client-side redirect to `/sk`:

```tsx
export default function RootRedirect() {
    return (
        <html>
            <head>
                <meta httpEquiv="refresh" content="0;url=/sk" />
                <link rel="canonical" href="https://kulturnekoncepty.sk/sk" />
            </head>
            <body />
        </html>
    )
}
```

On SSR platforms (Netlify, Vercel), the proxy handles `/` → `/sk` redirect automatically, so this page is never reached.

### SEO: Canonical URLs and hreflang

Every locale page declares canonical and hreflang tags in the locale layout `<head>`:

```tsx
<link rel="canonical" href={`${baseURL}${locale}`} />
<link rel="alternate" href={`${baseURL}sk`} hrefLang="sk" />
<link rel="alternate" href={`${baseURL}en`} hrefLang="en" />
<link rel="alternate" href={`${baseURL}sk`} hrefLang="x-default" />
```

**Key rules:**
- `x-default` points to the default locale (`/sk`), not the root `/`
- Root redirect page (`app/page.tsx`) sets its canonical to `/sk`
- Don't include the root redirect URL in the sitemap

### Trailing-slash redirects on GitHub Pages

With `trailingSlash: false` (default), Next.js generates `out/sk.html`. But because Next.js also creates an `out/sk/` directory (with internal data files), visiting `/sk/` on GitHub Pages would 404 (no `sk/index.html`).

Fix this with a post-build step in the workflow that creates redirect `index.html` files:

```yaml
- name: Add trailing-slash redirects
  run: |
    find ./out -name '*.html' ! -name 'index.html' ! -name '404.html' | while read file; do
      dir="${file%.html}"
      target="/${dir#./out/}"
      if [ -d "$dir" ]; then
        if [ ! -f "$dir/index.html" ]; then
          echo "<!DOCTYPE html><html><head><link rel=\"canonical\" href=\"https://kulturnekoncepty.sk${target}\"/><meta http-equiv=\"refresh\" content=\"0;url=${target}\"/></head></html>" > "$dir/index.html"
        fi
      fi
    done
```

### Sitemap via next-sitemap

**`next-sitemap.config.js`:**

```js
/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: 'https://kulturnekoncepty.sk',
    generateRobotsTxt: false,
    outDir: './out',
    exclude: ['/'],
}

module.exports = config
```

The `postbuild` script in `package.json` runs `next-sitemap` automatically after `npm run build`. In the GitHub Actions workflow, it's called explicitly as a separate step.

### GitHub Actions workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  repository_dispatch:
    types: [sanity-update]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Restore Next.js cache
        uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Build with Next.js
        run: npm run build
        env:
          GITHUB_PAGES: "true"

      - name: Generate sitemap
        run: npx next-sitemap

      - name: Add trailing-slash redirects
        run: |
          find ./out -name '*.html' ! -name 'index.html' ! -name '404.html' | while read file; do
            dir="${file%.html}"
            target="/${dir#./out/}"
            if [ -d "$dir" ]; then
              if [ ! -f "$dir/index.html" ]; then
                echo "<!DOCTYPE html><html><head><link rel=\"canonical\" href=\"https://kulturnekoncepty.sk${target}\"/><meta http-equiv=\"refresh\" content=\"0;url=${target}\"/></head></html>" > "$dir/index.html"
              fi
            fi
          done

      - name: Add .nojekyll
        run: touch ./out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub repository setup

1. Go to **Settings → Pages**
2. Set **Source** to `GitHub Actions`
3. Set the **Custom domain** to `kulturnekoncepty.sk` (see the next section for the full custom-domain + HTTPS setup)

### Custom domain + HTTPS (Cloudflare DNS)

This site runs on a **custom domain served from the root** (`https://kulturnekoncepty.sk`), with DNS at Cloudflare and hosting on GitHub Pages. Getting this right requires four things to agree with each other — if any drift apart you get the classic "no CSS" / "Not Secure" symptoms.

**1. Primary domain = apex, no `www`.** The canonical host is the apex `kulturnekoncepty.sk`; `www.kulturnekoncepty.sk` 301-redirects to it (GitHub Pages does this automatically once the apex is set as the custom domain). Every hard-coded URL in the codebase MUST use the apex, no `www`:

| Where | Value |
|---|---|
| `constants/site.ts` → `siteUrl` | `https://kulturnekoncepty.sk/` |
| `next-sitemap.config.js` → `siteUrl` | `https://kulturnekoncepty.sk` |
| `app/page.tsx` root-redirect canonical | `https://kulturnekoncepty.sk/sk` |
| `deploy.yml` trailing-slash redirect stubs | `https://kulturnekoncepty.sk${target}` |

> If these point to `www` while GitHub Pages serves the apex (or vice-versa), your `canonical`/`og:url`/sitemap URLs point to a **host that immediately redirects** — a self-inflicted SEO smell. Keep code and the Pages custom-domain setting on the same host.

**2. `basePath` must be unset.** See the `next.config.ts` section above — a custom root domain and `basePath` are mutually exclusive.

**3. `CNAME` file.** `public/CNAME` contains the apex domain (`kulturnekoncepty.sk`). Next copies `public/*` into `out/` on export, so the domain ships with every Actions deploy and can't be silently dropped. Its content must match the Custom domain in Settings → Pages.

**4. HTTPS certificate.** Cloudflare's DNS records for the apex + `www` are **"DNS only" (grey cloud)** — traffic goes straight to GitHub Pages, and **GitHub provisions the Let's Encrypt certificate** (covers both apex and `www`). After first setting the custom domain:
- The cert takes a few minutes up to ~24h to issue. **Until then the browser shows "Not Secure" — this is expected and self-resolves.** Don't "fix" it by switching Cloudflare to Flexible SSL; that would break things.
- Once the padlock is green, tick **Settings → Pages → Enforce HTTPS**.
- If you ever switch the Cloudflare records to **proxied (orange cloud)**, GitHub can no longer issue its cert — you then rely on Cloudflare's edge cert and must set the Cloudflare **SSL/TLS mode to Full** (never Flexible, which causes redirect loops with GitHub Pages).

### Environment variables for GitHub Actions

If your Sanity dataset is **private**, add this secret to GitHub:

1. Go to **Settings → Secrets and variables → Actions → New repository secret**
2. Add `SANITY_API_READ_TOKEN` with your Sanity API token

Then update `.github/workflows/deploy.yml` to use it:

```yaml
- name: Build with Next.js
  run: npm run build
  env:
    GITHUB_PAGES: "true"
    SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
```

For **public** datasets, no token is required.

### Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| `module is not defined in ES module scope` | `configure-pages` with `static_site_generator: next` generates CommonJS config | Remove `static_site_generator: next` from the workflow |
| `headers()` error during build | `force-static` blocks `headers()` | Pass locale explicitly from `params` to `getMessages({locale})`, `getTranslations({locale, namespace})` — never use `getLocale()` |
| Wrong locale / always default locale in dev | `proxy.ts` not recognized | Next.js 16 renamed `middleware.ts` → `proxy.ts`. Rename the file |
| Locale switcher goes to `/en/en` | `usePathname()` returns full path with locale prefix | Caused by broken locale resolution — fix the proxy filename and explicit locale passing |
| `requestLocale` always `undefined` | `force-static` blocks `headers()` used by next-intl internally | Pass locale explicitly via `params` to all next-intl server functions |
| Some sections render in wrong locale | Server components use `useTranslations` without `setRequestLocale` | Call `setRequestLocale(locale)` at the top of every layout/page in `[locale]` |
| Root `/` redirects to `/en` instead of `/sk` | next-intl detects browser's `Accept-Language` header | Set `localeDetection: false` in routing config |
| Images broken | Remote image optimization requires a server | Use `images.unoptimized: true` for GitHub Pages builds |
| `/sk/` returns 404 on GitHub Pages | `out/sk/` directory exists but has no `index.html` | Add trailing-slash redirect build step (see above) |
| Google picks wrong canonical (`/` instead of `/sk`) | Root redirect page has self-referencing canonical | Set canonical on `/` to `/sk`; point `x-default` hreflang to `/sk` |
| `redirects()` not working on production | `output: 'export'` ignores `redirects()` — they only work with a Node.js server | Use HTML redirect pages (`meta http-equiv="refresh"`) instead |
| Page loads unstyled — all CSS/JS 404 on the custom domain | Leftover `basePath` prefixes assets with `/repo-name/…` while the domain serves from root | Remove `basePath` from `next.config.ts` (custom root domain ⇒ no basePath). See Custom domain section |
| Browser shows "Not Secure" right after setting the custom domain | GitHub Pages hasn't provisioned the Let's Encrypt cert yet (takes minutes–24h) | Wait, then hard-refresh / try incognito; tick **Enforce HTTPS**. Do NOT switch Cloudflare to Flexible SSL |
| `canonical` / `og:url` / sitemap point to a redirecting host | Code uses `www` but Pages serves the apex (or vice-versa) | Align every hard-coded URL and `public/CNAME` to the primary host (apex, no `www`) |
| Custom domain disappears after an Actions deploy | Deploy artifact had no `CNAME`, so Pages lost the domain | Keep `public/CNAME` (apex domain) — it's exported into `out/` on every build |
