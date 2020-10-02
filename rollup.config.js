import path from "path";
import babel from "rollup-plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import Uglify from "rollup-plugin-uglify";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
const uglify = Uglify.uglify;
import merge from "lodash.merge";
import pkg from "./package.json";

const extensions = [".ts", ".tsx", ".js", ".json"];

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

// 打包任务的个性化配置
const jobs = {
  esm: {
    output: {
      format: "esm",
      file: resolve(pkg.module),
    },
  },
  umd: {
    output: {
      format: "umd",
      file: resolve(pkg.main),
      name: "rem",
    },
  },
  min: {
    output: {
      format: "umd",
      file: resolve(pkg.main.replace(/(.\w+)$/, ".min$1")),
      name: "rem",
    },
    plugins: [uglify()],
  },
};

// 从环境变量获取打包特征
const mergeConfig = jobs[process.env.FORMAT || "esm"];

module.exports = merge(
  {
    input: resolve("./packages/index.ts"),
    output: {},
    external: ["vue"],
    plugins: [
      json({
        namedExports: false,
      }),
      nodeResolve({
        extensions,
        modulesOnly: true,
      }),
      babel({
        exclude: "node_modules/**",
        extensions,
        runtimeHelpers: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      typescript({
        tsconfig: resolve("tsconfig.json"),
        cacheRoot: path.resolve(__dirname, "node_modules/.rts2_cache"),
        exclude: ["**/__tests__", "test-dts"],
      }),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  },
  mergeConfig,
);
