const path = require("path");

module.exports = {
	entry: {
		background: "./src/background.ts",
		foreground: "./src/foreground.ts",
	},
	output: {
		filename: "[name].js",
		// publicPath : 'dist/js/',
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	devtool: "source-map",

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
  },
  mode: "development"
};
