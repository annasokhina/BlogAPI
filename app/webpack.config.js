const path = require('path');
module.exports = {
	entry: './src/index.jsx',
	devtool: 'inline-source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'less-loader'}
				]
			},
			{
				test: /\.jsx$/,
				exclude: /(node_modules)/,
				use: {loader: 'babel-loader'}
			}
		]
	}
};
