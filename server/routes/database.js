const database = require('../database');

module.exports = (req, res) => {
  const responseDB = database.get(req.params.id);
  res.json(responseDB);
};
