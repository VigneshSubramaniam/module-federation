const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]",
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceMaps: true,
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'root',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:4000/remoteEntry.js',
        app2: 'app2@http://localhost:4001/remoteEntry.js',
      },
      exposes: {},
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: require('./package.json').dependencies.react,
          eager: true
        },
        'react-dom': { 
          singleton: true, 
          requiredVersion: require('./package.json').dependencies['react-dom'],
          eager: true
        },
        'react-router-dom': { 
          singleton: true, 
          requiredVersion: require('./package.json').dependencies['react-router-dom'],
          eager: true
        },
        '@shopify/polaris': { 
          singleton: true,
          eager: true
        },
        zustand: { 
          singleton: true,
          eager: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 4002,
    hot: true
  }
}; 