module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: { '@': './src' },
        },
      ],
      // Reanimated v4 moved its babel plugin into react-native-worklets; must
      // stay last in the plugins list.
      'react-native-worklets/plugin',
    ],
  };
};
