const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/dispatcher.jsx',
    output: {
    	path: __dirname,
	    filename: 'dispatcher.js',
	    library: "default",
	    libraryTarget: "umd"
    },
    module: {
    	rules: [
    		// compile jsx files
		    {
		    	test: /.jsx?$/,
			    loader: 'babel-loader',
			    exclude: /node_modules/,
			    options: {
		    		presets: [
		    			'@babel/preset-env',
					    '@babel/preset-react'
				    ]
		    	}
		    }
		]
    },
	resolve: {
		alias: {
			'react': path.resolve(__dirname, './node_modules/react'),
			'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
		}
	},
	externals: {
		// Don't bundle react or react-dom
		react: {
			commonjs: "react",
			commonjs2: "react",
			amd: "react",
			root: "react"
		},
		"react-dom": {
			commonjs: "react-dom",
			commonjs2: "react-dom",
			amd: "react-dom",
			root: "react-dom"
		}
	}
};