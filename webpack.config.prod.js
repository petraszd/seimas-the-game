var baseConfig = require('./webpack.config.js');

baseConfig.devtool = 'nosources-source-map';
module.exports = baseConfig;
