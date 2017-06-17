const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require("webpack-merge");
const devserver = require("./webpack/devserver");
const sass = require("./webpack/sass");
const css = require("./webpack/css");
const cssExtractor = require("./webpack/cssExtractor");

const common = {
	entry: "./src/index",
	output: {
		filename: "bundle.js",
		path: path.join(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: { presets: ['stage-3', 'es2015', 'react'] }
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/, use: [{
					loader: 'file-loader',
					query: {
						useRelativePath: process.env.NODE_ENV === "production"
					}
				}]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/, 
				use: "file-loader?publicPath=../&outputPath=css/fonts/"
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: false,
			template: './src/index.ejs',
			title_: "webpack test react"
		}),
	]
}
module.exports = function (env) {
	if (env === "production") {
		common.plugins.push(new webpack.optimize.UglifyJsPlugin());
		common.plugins.push(new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}))
		return merge([
			common,
			cssExtractor()
		]);
	}
	if (env === "development") {
		return merge([
			common,
			devserver(),
			sass(),
			css(),
			{ devtool: "cheap-eval-source-map" }
		])
	}
}