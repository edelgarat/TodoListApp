const path = require("path");
module.exports = function () {
	return {
		module: {
			rules:[{
				test: /\.(scss|sass)$/,
				include: path.join(__dirname, "../", "src", "styles", "sass"),
				use: ['style-loader', 'css-loader', 'sass-loader',]
			}]
		}
	}	
}