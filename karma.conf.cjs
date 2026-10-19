// karma.conf.cjs
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'vite'],
    files: [
      { pattern: 'src/**/*.spec.jsx', type: 'module', watched: false }
    ],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-vite')
    ],
    vite: {
      config: {
        root: path.resolve(__dirname),
        server: {
          fs: {
            allow: ['.']
          }
        }
      }
    },
    proxies: {
      '/src/': '/base/src/'
    },
    browsers: ['BraveHeadless'],
    customLaunchers: {
      BraveHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    singleRun: true
  });
};