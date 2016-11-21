/* eslint-disable dot-notation */
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Swag = require('swag');
const path = require('path');
const bodyParser = require('body-parser');
const requireDir = require('require-dir-all');
const routes = requireDir('./routes');
const { curry, toPairs, map, fromPairs, flow } = require('lodash/fp');

// =============================================================================
//   TEMPLATE ENGINE SETUP
// =============================================================================

// prepare Swag handlebars helpers
const helpers = {};
Swag.registerHelpers({ registerHelper(hn, hf) { helpers[hn] = hf; } });

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
  const hbsExtRegex = new RegExp(`${hbs.extname}$`);

  hbs.getTemplates(path.join(__dirname, 'templates/precompile'), {
    precompiled: true,
    cache: true,
  })
  .then(templates => {
    // Template names without extensions as object keys
    res.locals.templates = flow( // eslint-disable-line no-param-reassign
      toPairs,
      map(([key, val]) => [key.replace(hbsExtRegex, ''), val]),
      fromPairs
    )(templates);
    next();
  })
  .catch(next);
}

// =============================================================================
//    ROUTES SETUP
// =============================================================================

const LATENCY = 3000;


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

app.use('/', express.static(path.join(__dirname, '../client/build')));

const renderTemplate = curry((template, req, res) => {
  res.locals.title = template; // eslint-disable-line no-param-reassign
  res.render(template);
});

// Add some latency to simulate poor connectivity.
app.use('*', (req, res, next) => {
  setTimeout(next, LATENCY);
});

// Pages
app.get('/', (req, res) => res.redirect('/html/home'));
app.get('/html/offline', renderTemplate('offline'));
app.get('/html/home', renderTemplate('home'));
app.get('/html/contacts', renderTemplate('contacts'));
app.get('/html/projects', renderTemplate('projects'));
app.get('/html/messages', renderTemplate('messages'));

// API Routes
app.get('/api/messages', routes['messages']);
app.post('/api/new-message', routes['new-message']);
app.get('/api/contacts', routes['contacts']);
app.get('/api/projects', routes['projects']);
// Returns a precompiled template
app.get('/api/precompiled/:templateName', exposeTemplates, routes['precompiled']);


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
