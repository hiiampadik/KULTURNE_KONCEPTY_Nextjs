import createNextIntlPlugin from 'next-intl/plugin'
import type {NextConfig} from 'next'

const withNextIntl = createNextIntlPlugin('./localization/request.ts')

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

export default withNextIntl(nextConfig)
