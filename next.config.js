module.exports = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    return config;
  },
  env: {
    MONGO_URI: 'mongodb://localhost:27017/budget',
  },
};
