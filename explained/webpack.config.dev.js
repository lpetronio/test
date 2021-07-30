const path = require("path");
const filename = "polygenic-score-visual-explainer.min.js";
const library = "polygenicScoreVisualExplainer";
module.exports = {
    target: "web",
    entry: {
        app:"./index.js"
    },
    output: {
        filename: filename,
        path: path.resolve(__dirname, "build/js"),
        libraryTarget: "var",
        library: library,
    },
    devtool: "inline-source-map",
    devServer: {
        port: 3001,
        publicPath: "/build/js",
        contentBase: path.resolve(__dirname, "./"),
        watchContentBase: true,
        stats: {
            children: false
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                  outputPath: './images/icon-0',
                },
              },
        ]
    }
};
