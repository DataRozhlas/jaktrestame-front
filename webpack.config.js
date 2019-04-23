const path = require("path");

module.exports = {
  entry: "./js/script.js",
  output: {
    path: path.resolve(__dirname),
    filename: "output.js",
  },
  resolve: {
    mainFields: ["svelte", "browser", "module", "main"],
  },
  node: {
    fs: "empty",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: "svelte-loader",
        },
      },
    ],
  },
};
