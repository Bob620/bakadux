module.exports = {
    mode: 'production',
    entry: './dispatcher.jsx',
    output: {
    	path: __dirname,
	    filename: 'dispatcher.js'
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