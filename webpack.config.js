module.exports = {
  entry: './src/earth.js',
  output: {
    library: 'fe',
    libraryTarget: 'umd',
    filename: 'dist/f3Earth.js'       
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
    ]
  }
};