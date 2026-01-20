const path = require('path');

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    "server": "./src/server.tsx",
    "bracket-create": "./src/bracket-create.ts"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
};