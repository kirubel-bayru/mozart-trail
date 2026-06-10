import { rspack } from "@rspack/core";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env into process.env so DefinePlugin can read the values
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

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
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: "asset/resource",
      },
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
      "process.env.ORS_API_KEY": JSON.stringify(
        process.env.ORS_API_KEY || "",
      ),
      "process.env.USE_MUSIC_API": JSON.stringify(
        process.env.USE_MUSIC_API || "false",
      ),
    }),
  ],
  devServer: {
    port: 5173,
    hot: true,
    historyApiFallback: true,
    client: {
      logging: "info",
    },
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:4000",
      },
    ],
  },
};
