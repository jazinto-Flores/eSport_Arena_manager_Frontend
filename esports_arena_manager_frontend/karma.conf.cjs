// karma.conf.cjs

const path = require('path');
process.env.CHROME_BIN =
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['vite', 'jasmine'],

    files: [
      {
        pattern: 'src/**/*.spec.jsx',
        type: 'module',
        watched: false,
        served: false
      }
    ],

    plugins: [
      require('karma-vite'),
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],

    vite: {
      config: {
        root: path.resolve(__dirname),
        server: {
          preTransformRequests: false
        }
      }
    },

    browsers: ['CustomChromeHeadless'],

    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage']
        }
      },

    singleRun: true,
    autoWatch: false,

    reporters: ['progress'],

    client: {
      jasmine: {
        random: false
      }
    }
  });
};
