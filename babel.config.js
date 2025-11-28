module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
          '@': './src', // Map @ to the src directory
          '@assets': './src/Assets/',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};