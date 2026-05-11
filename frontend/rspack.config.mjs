import { rspack } from "@rspack/core";

const isDev = process.env.NODE_ENV !== "production";

export default {
  mode: isDev ? "development" : "production",
  entry: "./src/main.tsx",
  devtool: isDev ? "source-map" : false,
  output: {
    clean: true,
    filename: isDev ? "[name].js" : "[name].[contenthash].js",
    path: new URL("./dist", import.meta.url).pathname,
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        type: "javascript/auto",
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new rspack.DefinePlugin({
      "process.env.API_BASE_URL": JSON.stringify(
        process.env.API_BASE_URL || "http://localhost:4000",
      ),
    }),
  ],
  devServer: {
    port: 5173,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:4000",
      },
    ],
  },
};
