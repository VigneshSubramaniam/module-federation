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
    port: 4000,
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
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2@http://localhost:4001/remoteEntry.js",
        viteapp: 'viteapp@http://localhost:5173/dist/assets/remoteEntry.js'
      },
      exposes: {
        "./App": "./src/App"
      },
      shared: require("./package.json").dependencies,
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