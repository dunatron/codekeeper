const webpack = require('webpack');
const path = require('path');

const THEME_NAME = 'react-app'; // define SilverStripe theme name
const DOTENV = require('dotenv').config({path: '../../.env'});

var srcPath  = path.join(__dirname, './src/'),
    distPath = path.join(__dirname, './dist/');

// Allows a visual representation of the apps components
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = (env = {}) => {
  /**
   * Environment variables, needed throughout the index.jsx file to determine our
   * ApolloProvider client and graphQl endpoint
   */
  const Dev_Base_URL = 'http://code-keeper.d';
  const Prod_Base_URL = 'http://codekeeper.whatshapp.nz';
  const Env_Base_URL = DOTENV.parsed.SS_BASE_URL;

  const BuildType = env.buildType;
  let AppBaseURL = '';

  const ConsoleFont1 = '\x1b[32m\x1b[40m%s\x1b[0m'; // green font black BG
  const ConsoleFont2 = '\x1b[32m';

  console.log(ConsoleFont1, 'Webpack is building your project...');

  switch (BuildType) {
    case "dev":
      AppBaseURL = Dev_Base_URL;
      console.log(ConsoleFont1, AppBaseURL);
      break;
    case "prod":
      AppBaseURL = Prod_Base_URL;
      console.log(ConsoleFont1, AppBaseURL);
      break;
    case "env":
      AppBaseURL = Env_Base_URL;
      console.log(ConsoleFont1, AppBaseURL);
      break;
    case "location":
      console.log(ConsoleFont1, 'GraphQL will use window.location to determine the endpoint');
      AppBaseURL = ""; // if AppBaseURL.length=0 javascript will handle a blank url by using window.location
  }

  /**
   * Webpack variables
   */
  return {
    watch: false,
    cache: true,
    context: srcPath,
    entry: {
      app: ['babel-polyfill','./index.jsx'],
    },
    watchOptions: {
      poll: true
    },
    output: {
      path: path.resolve(__dirname, distPath),
      publicPath: '/themes/'+THEME_NAME+'/dist/',
      filename: '[name].bundle.js',
    },
    resolve: {
      modules: ["node_modules"],
      extensions: ['.js', '.jsx'],
    },
    devtool: "source-map",

    module: {


      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [{
            loader: 'babel-loader',
            // options not needed as babel-loader uses .babelrc file
            //options: { presets: ['es2015', 'stage-2', 'react'] },
          }],
        },
        {
          test: /\.jsx$/,
          exclude: [/node_modules/],
          use: [{
            loader: 'babel-loader',
            // options not needed as babel-loader uses .babelrc file
            //options: { presets: ['es2015', 'stage-2', 'react'] },
          }],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'], //Loaders are
          // processed in reverse array order. That means css-loader will run before style-loader.
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2|ttf|eot|svg|gif|png)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[path][name].[ext]',
                limit: 1,
                useRelativePath: false,
                svgo: {
                  quality: 10
                }
              }
            }
          ]
        }

      ],


      loaders: [

      ]

    },

    /**
     * This plugin creates a report about everything you are using in your js app.
     * Pro tip: Look for repeating packages and create a Webpack Common chunks plugin for repeats
     */
    plugins: [
      new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just
        // generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'static',
        // Host that will be used in `server` mode to start HTTP server.
        analyzerHost: '127.0.0.1',
        // Port that will be used in `server` mode to start HTTP server.
        analyzerPort: 8888,
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        // Module sizes to show in report by default.
        // Should be one of `stat`, `parsed` or `gzip`.
        // See "Definitions" section for more information.
        defaultSizes: 'parsed',
        // Automatically open report in default browser
        openAnalyzer: true,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: false,
        // Name of Webpack Stats JSON file that will be generated
        // if `generateStatsFile` is `true`.
        // Relative to bundles output directory.
        statsFilename: 'stats.json',
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules,
        // from stats file with `source: false` option.
        // See more options here:
        // https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        logLevel: 'info',
      }),

      /**
       * Allows us to use these as Global constants through our JS App
       */
      new webpack.DefinePlugin({
        BASE_URL_VARIABLE: JSON.stringify(AppBaseURL),
      }),

    ],


  }
};