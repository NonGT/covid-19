/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  target: 'webworker',
  entry: {
    decoder: './src/decoder/omvTileDecoder.ts',
  },
  output: {
    path: path.join(process.cwd(), 'public'),
    filename: '[name].bundle.js',
  },
  mode: process.env.NODE_ENV || 'development',
};
