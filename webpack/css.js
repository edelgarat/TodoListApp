const path = require("path");
module.exports = function () {
	return {
		module: {
			rules:[{
				test: /\.css$/,
				include: path.join(__dirname, "../", "src", "styles", "css"),
				use: ['style-loader', 'css-loader']
			}]
		}
	}	
}