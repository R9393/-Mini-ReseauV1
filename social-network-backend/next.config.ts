// next.config.js
module.exports = {
  // Configuration de base sans références à Prisma
  reactStrictMode: true,
  experimental: {
    // Ajoutez ici uniquement les options nécessaires
    // serverExternalPackages: ["pg"] // Optionnel si nécessaire
  },
  webpack: (config: { externals: { 'pg-hstore': string; pg: string }[] }) => {
    config.externals.push({
      'pg-hstore': 'commonjs pg-hstore',
      pg: 'commonjs pg',
    })
    return config
  }
}