
module.exports = {
  reactStrictMode: true,
  experimental: {
 
  },
  webpack: (config: { externals: { 'pg-hstore': string; pg: string }[] }) => {
    config.externals.push({
      'pg-hstore': 'commonjs pg-hstore',
      pg: 'commonjs pg',
    })
    return config
  }
}