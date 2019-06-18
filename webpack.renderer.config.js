module.exports = {
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  // externals: ['fs', 'electron'],
  // target: 'electron-renderer',
  // node: {
  //   fs: "empty"
  // },
};
