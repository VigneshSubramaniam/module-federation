const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 4001,
    hot: true,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              sourceMap: true,
            },
            transpileOnly: false,
          }
        },
      },
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            sourceMaps: true,
          }
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ],
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
};