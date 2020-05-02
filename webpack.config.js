const path = require('path');
const HWP = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/pupil.js'),
    output: {
	path: __dirname,
	filename: 'scripts/pupil.js'
    },
    module: {
	rules: [{
		test: /\.(js|jsx)$/,
		exclude: /node_modules/,
		use: {
		    loader: "babel-loader"
		}
	}]
    },
    plugins: [
	new HWP({
	    template: path.join(__dirname, 'src/pupil.html'),
	    filename: 'pupil.html'
	})
    ]
}
