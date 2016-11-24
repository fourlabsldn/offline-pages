/* eslint-disable quote-props */

const src = 'client/src';
const dest = 'client/build';
const path = require('path');

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  'flow-transpile-to-es5': {
    'sw-caching': {
      src: path.join(src, 'sw-caching/main.js'),
      dest: path.join(dest, 'service-workers'),
      rename: 'sw-caching.js',
      watch: path.join(src, 'sw-caching/**/*'),
    },
    'sw-everything-together': {
      src: path.join(src, 'sw-everything-together/main.js'),
      dest: path.join(dest, 'service-workers'),
      rename: 'sw-everything-together.js',
      watch: path.join(src, 'sw-everything-together/**/*'),
    },
    'handlebars-helpers': {
      src: 'server/templates/helpers/helpers.js',
      dest: 'server/templates/helpers/',
      rename: 'helpers-transpiled.js',
      config: { moduleName: 'handlebarsHelpers' },
    },
  },
  'copy-static': {
    src: [path.join(src, '**/*'), `!${path.join(src, 'service-worker')}`],
    dest,
    map: {},
  },
  'build': {
    src: './',
    tasks: ['flow-transpile-to-es5', 'copy-static'],
  },
});
