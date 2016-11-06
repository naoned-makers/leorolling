const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

/*
 * Dev configurations
 */
// Serveur de développement avec activation du Hot Module Replacement
exports.devServer = (options) => {
  return {
    entry: [
      "webpack-dev-server/client?http://" + options.host + ":" + options.port,
      "webpack/hot/only-dev-server",
      options.entry
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ["react-hot-loader/webpack"],
          exclude: /node_modules/,
          include: "src/components"
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
}

// Transformations CSS :
//    - résolution des @import et url()
//    - ajout de feuille de style au DOM via l'injection d'une balise <style>
exports.setupCSS = (paths) => {
  return {
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: paths
      }]
    }
  };
}

/*
 * Build configurations
 */
// Minification
exports.minify = () => {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          warnings: false,
          drop_console: true
        },
        mangle: {
          except: ['$', 'webpackJsonp'],
          screw_ie8: true,
          keep_fnames: true
        }
      })
    ]
  };
}

// Injection de variables globales à la compilation :
//    - spécialisation de comportements
//    - minification
exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);
  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

// Bundle splitting :
//    - création d'un nouveau bundle ('entry chunk')
//    - génération du manifest (utile pour une gestion de cache fiable)
exports.extractBundle = (options) => {
  const entry = {};
  entry[options.name] = options.entries;
  return {
    entry: entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
}

// Nettoyage de répertoire
exports.clean = (path) => {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
}

// Génération d'une feuille de style séparée (du JS => gestion du
// cache optimisée puisque dans bundles différents)
exports.extractCSS = (paths) => {
  return {
    module: {
      loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: paths
      }]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

// Suppression des portions de feuilles de style inutilisées
exports.purifyCSS = (paths) => {
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        paths: paths
      })
    ]
  };
}
