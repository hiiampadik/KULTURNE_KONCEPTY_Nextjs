# Kulturne Koncepty

Website for Kulturne Koncepty — built with Next.js 16+ (App Router), Sanity CMS, and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16+** (App Router) — static export for GitHub Pages
- **Sanity** — CMS for content
- **next-intl** — Czech / English i18n via `[locale]` URL segment
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

Configure static export for GitHub Pages using a `GITHUB_PAGES` env variable:

```ts
import type { NextConfig } from 'next'

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

export default nextConfig
```

> **basePath**: Only needed if the site is served at `username.github.io/repo-name` (no custom domain). Set it to `'/repo-name'`.

### App Router with `[locale]` segment

The App Router uses the `[locale]` URL segment (from next-intl plugin) to handle localization. This is automatically configured by the `next-intl` plugin wrapper.

**Directory structure:**

```
app/
  layout.tsx              ← root layout with next-intl setup
  [locale]/
    page.tsx              ← home page
    layout.tsx            ← locale layout
    (other pages)
public/
  (static assets)
```

**Server Components** — fetch Sanity data at build time:

```tsx
import { getLocale } from 'next-intl/server'
import { sanityFetch } from '@/sanity/client'

export default async function Page() {
  const locale = await getLocale()
  const data = await sanityFetch({
    query: YOUR_QUERY,
    params: { locale },
  })
  
  return <div>{/* render data */}</div>
}
```

**Client-side locale access:**

```tsx
'use client'

import { useLocale } from 'next-intl'

export function Component() {
  const locale = useLocale() // 'cs' or 'en'
  return <div>Locale: {locale}</div>
}
```

**Links with locale prefix** (automatic with next-intl):

```tsx
import Link from 'next/link'

// No need to manually add locale — next-intl handles it automatically
<Link href="/projects">Projects</Link>
```

### GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

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
        run: npm ci

      - name: Build with Next.js
        run: npm run build
        env:
          GITHUB_PAGES: "true"

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
3. (Optional) Set custom domain if not using `username.github.io/repo-name`

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

### Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| Build fails: "Cannot find module" | Server Component tries to import client library at build time | Use `'use client'` at the top of components that use browser APIs |
| Build fails: Sanity query error | Query tries to fetch during build | Ensure `SANITY_API_READ_TOKEN` env var is available in GitHub Actions |
| Images not loading | Remote images require optimization | Use `images.unoptimized: true` in next.config.ts for GitHub Pages builds |
| Links broken | basePath not set correctly | If using subdomain deployment, add `basePath: '/repo-name'` to next.config.ts |
| Locale not detected | next-intl not configured | Ensure `[locale]` segment is in app directory and layout wraps content with next-intl provider |
