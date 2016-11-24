/* eslint-disable camelcase, no-param-reassign */
const fs = require('fs');
const path = require('path');

const addressOf = id =>
  path.join(__dirname, `db-${id}.json`);

const readJSON = id =>
  JSON.parse(
    fs.readFileSync(
      addressOf(id)
    )
  );

const writeJSON = (id, content) =>
  fs.writeFileSync(
    addressOf(id),
    JSON.stringify(content)
  );

function get(id) {
  // We read the file in every request because in the test
  // it is important for us to be able to modify the values and
  // see a result live.
  const db = {
    contacts: readJSON('contacts'),
    messages: readJSON('messages'),
    projects: readJSON('projects'),
  };

  // If there is no valid ID, we send the whole database.
  // Obviously in a real application this should never be like that.
  return db[id] || db;
}

function set(id, content) {
  return writeJSON(id, content);
}

module.exports = { get, set };
