const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require("path");

module.exports = function () {
	return {
		module: {
			rules: [{
				test: /\.(scss|sass)$/,
				include: path.join(__dirname, "../", "src", "styles", "sass"),
				use: ExtractTextPlugin.extract({
					publicPath: '../',
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
				})
			}, {
				test: /\.css$/,
				include: path.join(__dirname, "../", "src", "styles", "css"),
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			}]
		},
		plugins: [
			new ExtractTextPlugin('./css/[name].css'),
		]
	}
}