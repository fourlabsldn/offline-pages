// List all available tasks

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  'browser-sync': {
    src: '.', // it doesn't matter, it's just so the task object is not ignored.
    reloadOn: ['transpile-react'], // reload page when these tasks happen
    startPath: 'pages/index.html',
    baseDir: './demo',
  },
});
