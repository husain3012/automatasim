module.exports = {
  reactStrictMode: true,
  webpack: (config, _) => {
    config.module.rules.push(      {
      test: /\.(mp3)$/,
      type: 'asset',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      },
    });

      return config;
  }
}

