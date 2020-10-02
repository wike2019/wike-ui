import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "rollup-plugin-postcss";
import less from "node-less";
import path from "path";

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

const processLess = function (context, payload) {
  return new Promise((resolve, reject) => {
    less.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      },
    );
  });
};

module.exports = {
  input: resolve("../packages/styles/index.less"),
  output: {
    file: resolve("../dist/style/wike-ui.min.css"),
  },
  plugins: [
    postcss({
      extensions: [".css", ".less", ".less"],
      process: processLess,
      plugins: [
        autoprefixer(),
        cssnano({
          preset: "default",
        }),
      ],
      extract: true,
    }),
  ],
};
