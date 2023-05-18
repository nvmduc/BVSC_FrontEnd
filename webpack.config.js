const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify")
    }
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 700000, // Giới hạn kích thước cho từng file bundle
    maxEntrypointSize: 700000, // Giới hạn kích thước cho bundle chính
  },
};
