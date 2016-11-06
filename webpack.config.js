const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const configParts = require('./libs/config-parts');
const pkg = require('./package.json');

const PATHS = {
  client: path.join(__dirname, "index.js"),
  style: [
    path.join(__dirname, "node_modules", "purecss"),
    path.join(__dirname, "static", "styles", "style.css")
  ],
  build: path.join(__dirname, "static", "js")
};

const common = {
  entry: {
    //style: PATHS.style,
    client: PATHS.client
  },
  output: {
    //path: "static",//PATHS.build,
    filename: 'static/js/client.js'
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".css", ".html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Make Leo roll',
      template: '!!html!./static/index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel", // 'babel-loader' is also a valid name to reference
        query: {
          presets: ["es2015", "react"]
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  }
};

var config;

switch (process.env.npm_lifecycle_event) {
  case "build":
  case "stats":
    config = merge(
      common, {
        devtool: "source-map",
        output: {
          //publicPath: "/static/js/",
          filename: "static/js/[name].[chunkhash].js",
          chunkFilename: "static/js/[chunkhash].js"
        }
      },
      configParts.clean(PATHS.build),
      configParts.setFreeVariable("process.env.NODE_ENV", "production"),
      configParts.extractBundle({
        name: "vendor",
        entries: Object.keys(pkg.dependencies)
      }),
      configParts.minify()/*,
      configParts.extractCSS(PATHS.style),
      configParts.purifyCSS([PATHS.client])*/
    );
    break;
  default:
    config = merge(
      common, {
        devtool: "cheap-module-eval-source-map"
      },
      //configParts.setupCSS(PATHS.style),
      configParts.devServer({
        host: "localhost",
        port: 5000,
        entry: PATHS.client
      })
    );
}

console.log(config);

// Exécution du validateur en mode silencieux pour éviter du texte superflu
// vers des sorties json (et donc pour la commande 'stats')
module.exports = validate(config, {
  quiet: false
});
