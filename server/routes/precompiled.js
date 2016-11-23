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

test = {"1":function(container,depth0,helpers,partials,data) {
    return "active";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"icon\" type=\"image/png\" href=\"/static/favicon.png\" sizes=\"32x32\">\n    <title>Offline pages</title>\n    <!-- Bootstrap -->\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.5/css/bootstrap.min.css\">\n    <!-- Custom styles and JS -->\n    <link rel=\"stylesheet\" href=\"/static/styles/styles.css\">\n    <script src=\"/static/js/main.js\"></script>\n  </head>\n  <body>\n    <div class=\"container\">\n      <nav class=\"navbar navbar-dark bg-inverse\">\n          <ul class=\"nav navbar-nav\">\n            <li class=\"nav-item "
    + ((stack1 = (helpers.is || (depth0 && depth0.is) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),"home",{"name":"is","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nav-link\" href=\"/html/home\">Home</a>\n            </li>\n            <li class=\"nav-item "
    + ((stack1 = (helpers.is || (depth0 && depth0.is) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),"contacts",{"name":"is","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nav-link\" href=\"/html/contacts\">Contacts</a>\n            </li>\n            <li class=\"nav-item "
    + ((stack1 = (helpers.is || (depth0 && depth0.is) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),"projects",{"name":"is","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nav-link\" href=\"/html/projects\">Projects</a>\n            </li>\n            <li class=\"nav-item "
    + ((stack1 = (helpers.is || (depth0 && depth0.is) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),"messages",{"name":"is","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nav-link\" href=\"/html/messages\">Messages</a>\n            </li>\n            <li class=\"nav-item "
    + ((stack1 = (helpers.is || (depth0 && depth0.is) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),"contacts",{"name":"is","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nav-link\" href=\"/html/contact-info\">Contacts</a>\n            </li>\n          </ul>\n      </nav>\n      <br>\n      "
    + ((stack1 = ((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"body","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n  </body>\n</html>\n";
},"useData":true};
