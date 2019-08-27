const path = require('path');


module.exports = {
    entry: "./app/scripts/App.js",
    output: {
        path: path.resolve(__dirname, "./app/temp/scripts"),
        filename: "App.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options : {
                        presets: ['es2015']
                    }
                }
            }
        ]
    }
};