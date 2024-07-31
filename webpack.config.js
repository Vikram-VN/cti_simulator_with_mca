const path = require('path');
const baseDirectory = "src";

module.exports = {
  mode: "production",
  entry: {
    "public/js/clientApp": [`./${baseDirectory}/public/ts/clientApp`],
    "public/js/ctiAdmin": [`./${baseDirectory}/public/ts/ctiAdmin`],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map", // Use source-map for better debugging experience
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
    sourceMapFilename: "[file].map" // Ensure source maps are generated
  },
};
