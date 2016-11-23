/* eslint-disable dot-notation */
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const requireDir = require('require-dir-all');
const routes = requireDir('./routes');
const helpers = require('./templates/helpers/helpers');
const { curry, toPairs, map, fromPairs, flow } = require('lodash/fp');

// =============================================================================
//   TEMPLATE ENGINE SETUP
// =============================================================================

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers,
  layoutsDir: path.join(__dirname, 'templates/layouts'),
  partialsDir: path.join(__dirname, 'templates/partials'),
});

// === Middleware ===

// Use Handlebars
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'templates'));

// Expose precompiled templates in res.locals.templates
function exposeTemplates(req, res, next) {
  const templatesSrc = path.join(__dirname, 'templates/');

  hbs.getTemplates(templatesSrc, { precompiled: true })
  .then(_ => {
    // Template names without extensions as object keys
    res.locals.templates = flow( // eslint-disable-line no-param-reassign
      toPairs,
      map(([key, val]) => [key.replace(hbs.extname, ''), val]), // remove extension
      map(([key, val]) => [key.replace(templatesSrc, ''), val]), // remove filesystem path
      // Replace slashes with dots so we can reference files withing folders form the client.
      map(([key, val]) => [key.replace('/', '.'), val]),
      fromPairs
    )(hbs.precompiled);
    next();
  })
  .catch(next);
}

// =============================================================================
//    ROUTES SETUP
// =============================================================================

const LATENCY = 0;


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  // Allow CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Log request info
  console.log(`${req.url} ${Date().toString()}`);
  next();
});

const renderTemplate = curry((template, req, res) => {
  res.locals.title = template; // eslint-disable-line no-param-reassign
  res.render(template);
});

// Add some latency to simulate poor connectivity.
app.use('*', (req, res, next) => {
  setTimeout(next, LATENCY);
});

// ==================
// Static content
// ==================
// The service-worker must be served from the root to be able to manage all domain requests.
app.use(
  '/service-worker.js',
  (req, res) => res.sendFile(path.join(__dirname, '../client/build/service-worker.js'))
);
app.use(
  '/service-worker.js.map',
  (req, res) => res.sendFile(path.join(__dirname, '../client/build/service-worker.js.map'))
);
app.use('/static', express.static(path.join(__dirname, '../client/build')));

// ==================
// Pages
// ==================
app.get('/', (req, res) => res.redirect('/html/home'));
app.get('/html/offline', renderTemplate('offline'));
app.get('/html/home', renderTemplate('home'));
app.get('/html/contacts', renderTemplate('contacts'));
app.get('/html/projects', renderTemplate('projects'));
app.get('/html/messages', renderTemplate('messages'));
app.get('/html/contact-info', renderTemplate('contact-info'));
app.get('/html/contact-info-shell', renderTemplate('contact-info-shell'));

// ==================
// API Routes
// ==================
app.get('/api/messages', routes['messages']);
app.post('/api/new-message', routes['new-message']);
app.get('/api/contacts', routes['contacts']);
app.get('/api/projects', routes['projects']);

// These two endpoints have `.js` extension because they are Javascript files.
// Returns a precompiled template
app.get('/api/precompiled/:templateName.js', exposeTemplates, routes['precompiled']);
// Handlebars helpers
app.use(
  '/api/template-helpers',
  express.static(path.join(__dirname, '/templates/helpers'))
);


// =============================================================================
//    SERVER STARTUP
// =============================================================================

const http = require('http').Server(app); // eslint-disable-line new-cap
const PORT = 3000;
http.listen(PORT, () => {
  console.log(`
    Offline pages server listening on port ${PORT}
  `);
});
