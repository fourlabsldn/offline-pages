/**
 * Allows the partial to be required by requireJS
 * @method toUmdPartial
 * @param  {String} precompiledTemplate
 * @param  {String} templateName
 * @return {String} - The string function to be executed by the client
 */
function toUmdPartial(precompiledTemplate, templateName) {
  return `
  (function (root, factory) {
      if (typeof define === "function" && define.amd) {
          define(["handlebars"], factory);
      } else if (typeof exports === "object") {
          module.exports = factory(require("handlebars"));
      } else {
          root.returnExports = factory(root.Handlebars);
      }
  }(this, function (handlebars) {
      var partial = ${precompiledTemplate};
      handlebars.partials['${templateName}'] = partial;
      return partial;
  }));`;
}

module.exports = (req, res) => {
  const { templateName } = req.params;

  res.locals.templates[templateName]
    .then(precompiled => {
      res.setHeader('Content-Type', 'application/javascript');
      res.send(toUmdPartial(precompiled, templateName));
    })
    .catch(error => req.send({ error }));
};
