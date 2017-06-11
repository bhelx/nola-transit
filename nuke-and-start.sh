watchman watch-del-all
rm -rf node_modules
yarn
react-native link
npm start -- --reset-cache

