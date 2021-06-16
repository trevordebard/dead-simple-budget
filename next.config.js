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
};
