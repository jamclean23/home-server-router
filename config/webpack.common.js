const path = require('path');

module.exports = {
    entry: {
        '/diffusion/diffusion': './src/diffusion/diffusion.js',
        '/diffusionKeyConf/diffusionKeyConf': './src/diffusionKeyConf/diffusionKeyConf.js',
        '/diffusionTest/diffusionTest': './src/diffusionTest/diffusionTest.js',
        '/serverInfo/serverInfo': './src/serverInfo/serverInfo.js',
        '/diffusionApiRequest/diffusionApiRequest': './src/diffusionApiRequest/diffusionApiRequest.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }            
        ]
    }
}