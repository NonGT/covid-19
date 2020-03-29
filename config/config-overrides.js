const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/core/glDecoder.ts',
    template: 'public/empty.html',
    outPath: '/gl-decoders.js'
  }
]);

const BabelPlugin = require("babel-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const { addHarpWebpackConfig } = require("@here/harp-webpack-utils/scripts/HarpWebpackConfig");
const myConfig = {};

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  multipleEntry.addMultiEntry(config);

  const decoderConfig = config.plugins[config.plugins.length - 1];
  decoderConfig.options.inject = true;
  // decoderConfig.options.templateContent = true;

	// const babelPlugin = new MinifyPlugin({}, {
	// 	test: "/gl-decoders.js",
	// 	presets: ['es2015'],
	// 	sourceMaps: false,
	// 	compact: false
  // });
  
  // config.plugins[config.plugins.length - 1] = babelPlugin;

  const c = addHarpWebpackConfig(
    myConfig,
    { mainEntry: "./index.js", decoderEntry: "./gl-decoders.js", htmlTemplate: "./index.html" }
  );

  // console.log(c);
  // // console.log(c[0].plugins[0]);
  // process.exit();

  config.plugins[config.plugins.length - 1] = decoderConfig;
  config.plugins.push(c[0].plugins[0]);
  console.log(config.plugins[config.plugins.length - 1]);
  // process.exit();
  return config;
}
