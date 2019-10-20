// webpack.config.js
const path = require("path");

module.exports = {
    context: __dirname
    , entry: "./frontend/app.jsx"
    , output: {
        path: path.join(__dirname)
        , filename: "bundle.js"
    }

    , module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.js?$/]
                , exclude: /(node_modules)/
                , loader: 'babel-loader'
                , query: {
                    presets: [
                        '@babel/env'
                        , '@babel/react'
                    ]
                }
            }
        ]
    }
    , devtool: 'source-map',
    resolve: {
        extensions: [
            ".js"
            , ".jsx"
            , "*"
        ]
    }
};
