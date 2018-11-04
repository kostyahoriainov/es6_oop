const webpack = require('webpack');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';


module.exports = {
      entry: {
        "index": ["./src/index.js"],
        "panel": ["./src/panel.js"],
        "todos": ["./src/todos.js"],
        "chat": ["./src/chat.js"],
        "table": ["./src/table.js"],
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/assets/",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
              test: /\.js?/,
              exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }        ]
    },
    plugins: [
      
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        port: 8000,
        watchContentBase: true
    }
};

if(!isProd) {
    module.exports.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    );
}