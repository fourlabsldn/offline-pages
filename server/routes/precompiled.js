module.exports = (req, res) => {
  const precompiled = res.locals.templates[req.params.templateName];
  res.send(precompiled);
};
