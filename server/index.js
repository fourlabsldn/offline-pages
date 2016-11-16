const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const requireDir = require('require-dir-all');
const routes = requireDir('./routes');


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

app.use('/', express.static(path.join(__dirname, '../client')));

// Routes
app.get('/messages', routes.messages);
app.post('/new-message', routes['new-message']);
app.get('/user-info', routes['user-info']);


// Start server
const http = require('http').Server(app); // eslint-disable-line new-cap
const PORT = 8080;
http.listen(PORT, () => {
  console.log(`
    Silve-Magpie development server listening on port ${PORT}
  `);
});
