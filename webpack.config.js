const path = require('path');

module.exports = {
    mode: 'production',
    entry: './agora_module.js',
    output: {
        filename: 'agora_rtm_bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    devServer: {
        compress: true,
        port: 9000
    }
};