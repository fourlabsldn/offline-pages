module.exports = (req, res) => {
  const partialName = req.params.templateName;

  res.locals.templates[`precompile/${partialName}`]
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
          handlebars.partials['${partialName}'] = partial;
          return partial;
      }));`);
    })
    .catch(error => req.send({ error }));
};
