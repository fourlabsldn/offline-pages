/* eslint-disable dot-notation */
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Swag = require('swag');
const path = require('path');
const bodyParser = require('body-parser');
const requireDir = require('require-dir-all');
const routes = requireDir('./routes');
const { curry } = require('lodash/fp');

// =============================================================================
//   TEMPLATE ENGINE SETUP
// =============================================================================

// prepare Swag handlebars helpers
const helpers = {};
Swag.registerHelpers({ registerHelper(hn, hf) { helpers[hn] = hf; } });

// Use Handlebars
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers,
  layoutsDir: path.join(__dirname, 'templates/layouts'),
  partialsDir: path.join(__dirname, 'templates/partials'),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'templates'));

// =============================================================================
//    ROUTES SETUP
// =============================================================================

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

// Pages
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', renderTemplate('home'));
app.get('/contacts', renderTemplate('contacts'));
app.get('/projects', renderTemplate('projects'));
app.get('/offline', renderTemplate('offline'));

// API Routes
// app.get('/messages', routes['messages']);
// app.post('/new-message', routes['new-message']);
// app.get('/contacts', routes['contacts']);
// app.get('/contact-info', routes['contact-info']);
// app.get('/projects', routes['projects']);


// =============================================================================
//    SERVER STARTUP
// =============================================================================

const http = require('http').Server(app); // eslint-disable-line new-cap
const PORT = 8080;
http.listen(PORT, () => {
  console.log(`
    Offline pages server listening on port ${PORT}
  `);
});
