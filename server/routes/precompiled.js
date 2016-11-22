module.exports = (req, res) => {
  const { templateName } = req.params;

  res.locals.templates[templateName]
    .then(precompiled => {
      res.setHeader('Content-Type', 'application/javascript');
      res.send(`
      (function (root, factory) {
          if (typeof define === "function" && define.amd) {
              define(["handlebars"], factory);
          } else if (typeof exports === "object") {
              module.exports = factory(require("handlebars"));
          } else {
              root.returnExports = factory(root.Handlebars);
          }
      }(this, function (handlebars) {
          var partial = ${precompiled};
          handlebars.partials['${templateName}'] = partial;
          return partial;
      }));`);
    })
    .catch(error => req.send({ error }));
};
