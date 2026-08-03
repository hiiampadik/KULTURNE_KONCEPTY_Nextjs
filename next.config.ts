import createNextIntlPlugin from 'next-intl/plugin'
import type {NextConfig} from 'next'

const withNextIntl = createNextIntlPlugin('./localization/request.ts')

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
    ...(isGithubPages && {
        output: 'export',
        // basePath odstránený – web beží na vlastnej doméne (kulturnekoncepty.sk) z rootu.
        // Pri nasadení cez subcestu (napr. user.github.io/REPO) ho vrátiť späť: basePath: '/KULTURNE_KONCEPTY_Nextjs'
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
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

export default withNextIntl(nextConfig)
