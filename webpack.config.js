module.exports = {
    entry: {
        actives: './index.js'
    },
    output: {
        filename: "dist/es5.tmp.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}