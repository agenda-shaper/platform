module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:@babel/preset-typescript"],
    env: {
      production: {
        // plugins: ["transform-remove-console"],
      },
    },
  };
};
