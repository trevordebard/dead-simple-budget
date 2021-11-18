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
  experimental: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
};
