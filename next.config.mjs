/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // RSCの問題を解決するための設定
  experimental: {
    serverComponentsExternalPackages: ['@line/liff'],
    // RSCの安定性を向上
    serverActions: {
      allowedOrigins: ['localhost:3000', 'slideshow-poc.vercel.app']
    }
  },
  // パフォーマンス最適化
  swcMinify: true,
  compress: true,
  // メモリ使用量の最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // RSCペイロードの問題を回避
  output: 'standalone',
  // 静的生成を無効化してCSRにフォールバック
  trailingSlash: false,
  // キャッシュ設定
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
