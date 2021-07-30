const path = require("path");
const filename = "polygenic-score-visual-explainer.min.js";
const library = "polygenicScoreVisualExplainer";
module.exports = {
    entry: "./index.js",
    output: {
        filename: filename,
        path: path.resolve(__dirname, "build/js"),
        libraryTarget: "var",
        library: library,
    },
    devtool: "inline-source-map",
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
