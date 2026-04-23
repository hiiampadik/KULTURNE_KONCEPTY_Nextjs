import createNextIntlPlugin from 'next-intl/plugin'
import type {NextConfig} from 'next'

const withNextIntl = createNextIntlPlugin('./localization/request.ts')

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
    ...(isGithubPages && {
        output: 'export',
        trailingSlash: true,
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
