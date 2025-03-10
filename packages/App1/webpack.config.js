const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.tsx",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 4000,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "http://localhost:4000/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  // pass all js files through Babel
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2@http://localhost:4001/remoteEntry.js",
        root: "root@http://localhost:4002/remoteEntry.js"
      },
      exposes: {
        "./App": "./src/App"
      },
      shared: {
        ...require("./package.json").dependencies,
        zustand: { singleton: true, eager: true }
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};

// module.exports = (_, argv) => ({
//   output: {
//     filename: "main.js",
//     path: path.resolve(__dirname, "build"),
//     publicPath:
//       argv.mode === "development"
//         ? "http://localhost:8081/"
//         : "https://prod-test-consumer.vercel.app/",
//   },

//   resolve: {
//     extensions: [".*",".jsx", ".js"],
//   },

//   devServer: {
//     port: 8081,
//   },

//   module: {
//     rules: [
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       },
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//     ],
//   },

//   plugins: [
//     new ModuleFederationPlugin({
//       name: "consumer",
//       filename: "remoteEntry.js",
//       remotes: {
//         header: "header@https://prod-test-header.vercel.app/remoteEntry.js",
//       },
//       exposes: {},
//       shared: require("./package.json").dependencies,
//     }),
//     new HtmlWebPackPlugin({
//       template: "./src/index.html",
//     }),
//   ],
// });