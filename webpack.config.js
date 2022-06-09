const path = require("path");

module.exports = {
	entry: {
		background: "./src/background.ts",
		foreground: "./src/foreground.ts",
		ui_test: "./src/ui_test.ts",
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
	devServer: {
		static: {
		  directory: path.join(__dirname, ''),
		},
		compress: true,
		port: 9000,
		liveReload: true,
		open: true
	  },

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
  },
  mode: "development"
};
