/**
 * @type {import('next').NextConfig}
 */
const securityHeaders = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },

    // 防止XSS攻击

    // {
    //     key: 'Content-Security-Policy',
    //     value: ""
    // }

]
module.exports = {
    reactStrictMode: true,
    exportPathMap: async function(
        defaultPathMap, { dev, dir, outDir, distDir, buildId }
    ) {
        return {
            '/': { page: '/' },
            '/500': { page: '/500' },
            "/404": { page: '/404' }
        }
    },
    experimental: {
        images: {
            unoptimized: true,
        },
    },
    async headers() {
        return [{
            // Apply these headers to all routes in your application.
            source: '/(.*)',
            headers: securityHeaders,
        }, ]
    },
}