module.exports = {
  entry: {
    f3Earth: './src/earth.js',
    mouseWheelZoomInteraction:'./src/interaction/mouseWheelZoomInteraction.js',
    dragInteraction:'./src/interaction/dragInteraction.js',
    doubleClickZoomInteraction: './src/interaction/doubleClickZoomInteraction.js'
  },
  output: {
    libraryTarget: 'umd',
    filename: 'dist/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: false
        }
      }
    ],
    noParse: [/proj4/]
  },
};