const path = require("path");
const webpack = require("webpack");
const sass = require("sass");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer")({
    overrideBrowserslist: ["> 1%", "last 2 versions", "Firefox ESR"],
    remove: false
});

module.exports = (env, argv) => {
  // Settings
  // --mode ... --devtool  ...
  console.log(`
Build started with following configuration:
===========================================
→ mode: ${argv.mode}
→ devtool: ${argv.devtool}
`);

  const publicPath = "/assets/";
  const limit = 1024;

  return {
      devtool: argv.devtool,
      performance: {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000
      },
      entry: {
        app: [
            path.resolve(__dirname, "scripts", "main.js")
        ]
      },
      output: {
        path: path.resolve(__dirname, "..", "static", "assets"),
        filename: "[name].js?[contenthash]",
        publicPath
      },
      resolve: {
        extensions: [".js"]
      },
      bail: false,
      module: {
        rules: [{
            test: /\.s[ac]ss$/,
            use: [
                argv.mode === 'production' ? "style-loader" : MiniCssExtractPlugin.loader,
                { loader: "css-loader",
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [[function () {
                                           return [
                                               autoprefixer
                                           ];
                                        }
                                    ],
                            ],
                        },
                        sourceMap: true,
                    },
                },
                {
                    loader: "sass-loader",
                    options: {
                        implementation: sass,
                        sourceMap: true,
                    },
                },
            ],
        },
        {
            test: /\.css$/,
            use: [
                argv.mode === 'production' ? "style-loader" : MiniCssExtractPlugin.loader,
                { loader: "css-loader",
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: "postcss-loader",
                    options: {
                        plugins: function () {
                            return [
                                autoprefixer
                            ];
                        },
                    },
                }
            ],
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: "url-loader",
            options: {
                limit,
                publicPath,
                name: "/images/[name].[ext]?[contenthash]"
            },
        },
        {
            test: /\.(svg|eot|woff|woff2|ttf)$/,
            type: 'asset/resource',
            generator: {
                publicPath: "/assets/",
                filename: '[name][ext]?[contenthash]'
            }
        },
        ],
      },
      plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css?[contenthash]",
            chunkFilename: "[id].css?[contenthash]",
          }),
          new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "window.jQuery": "jquery",
              Popper: ['popper.js', 'default'],
              Util: "exports-loader?Util!bootstrap/js/dist/util"
          }),
          new HtmlWebpackPlugin({
              filename: "../../layouts/partials/assets.html",
              template: "assets.ejs",
              inject: false
          })
      ],
  };
};