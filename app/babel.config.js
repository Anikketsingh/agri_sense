module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only add reanimated plugin if needed
      // 'react-native-reanimated/plugin',
    ],
  };
};
