import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [
    postcssPresetEnv({
      browsers: "last 2 versions, > 1%, IE 11",
    }),
    tailwindcss,
    autoprefixer,
  ],
};
