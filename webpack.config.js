// webpack.development.config.js
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        port: 8090
    },
    module: {
        rules: [
            {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
            },
        ],
    }
}
