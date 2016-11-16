/* eslint-disable quote-props */

// List all available tasks

const src = 'static/src';
const dest = 'static/build';
const path = require('path');

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  'flow-transpile-to-es5': {
    src: path.join(src, 'service-worker/main.js'),
    dest,
    rename: 'service-worker.js',
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
