module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/budget',
        permanent: true,
      },
    ];
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    return config;
  },
};
