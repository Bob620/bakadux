const path = require('path');

module.exports = {
    mode: 'development',
    entry: './example/components/app/index.jsx',
    output: {
    	path: path.resolve(__dirname, 'example/dist'),
	    filename: 'bundle.js'
    },
    module: {
    	rules: [
    		// compile jsx files
		    {
		    	test: /.jsx?$/,
			    loader: 'babel-loader',
			    exclude: /node_modules/,
			    options: {
		    		presets: ['@babel/preset-env', '@babel/preset-react']
		    	}
		    }
		]
    },
    serve: {
    	content: './example/views',
	    dev: {
    		publicPath: '/dist'
	    },
	    port: 3000
    }
};