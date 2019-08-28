const path = require('path');


module.exports = {
    entry: {
        App: "./app/scripts/App.js",
        Vendor: "./app/scripts/Vendor.js"
    },
    output: {
        path: path.resolve(__dirname, "./app/temp/scripts"),
        filename: "[name].js"
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