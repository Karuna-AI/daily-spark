module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@services': './src/services',
            '@constants': './src/constants',
            '@types': './src/types',
            '@utils': './src/utils',
          },
        },
      ],
      // IMPORTANT: react-native-reanimated/plugin MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};
