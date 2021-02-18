/* eslint-disable linebreak-style */
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  mode: 'production',

  entry: {
    index: '/public/assets/js/index.js',
  },
  output: {
    path: `${__dirname}/public/dist`,
    filename: '[name].bundle.js',
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      short_name: 'Budget Tracker',
      name: 'Budget Tracker',
      start_url: '/',
      icons: [{
        src: path.resolve('public/assets/img/icons/icon_192x192.png'),
        sizes: [40, 96, 128, 192, 256, 384, 512],
        destination: path.join('assets', 'icons'),
        purpose: 'any maskable',
      }],
      background_color: '#FEFEFE',
      display: 'standalone',
      theme_color: '#FEFEFE',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
module.exports = config;
