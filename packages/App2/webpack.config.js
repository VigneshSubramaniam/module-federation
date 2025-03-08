const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 4001,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        './app': "./src/App",
        './sharedComponents': './src/MultipleComponents',
      },
      shared: require("./package.json").dependencies,
    }),
  ],
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: [".*", ".js", ".jsx"],
  }
};