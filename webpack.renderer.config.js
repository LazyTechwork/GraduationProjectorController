const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const assets = ["static"];

rules.push({
    test: /\.s[ac]ss$/i,
    use: [
        "style-loader",
        "css-loader",
        "sass-loader",
    ]
});

module.exports = {
    // Put your normal webpack config below here
    module: {
        rules,
    },
    plugins: assets.map(asset => {
        return new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src', asset),
                to: path.resolve(__dirname, '.webpack/renderer', asset)
            }]
        });
    })

};
