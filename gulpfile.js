/* eslint-disable quote-props */

const src = 'client/src';
const dest = 'client/build';
const path = require('path');

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  'flow-transpile-to-es5': {
    client: {
      src: path.join(src, 'service-worker/main.js'),
      dest,
      rename: 'service-worker.js',
      watch: path.join(src, 'service-worker/**/*'),
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
