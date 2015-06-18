/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  jscsOptions: {
    enabled: true,
    testGenerator: function(relativePath, errors) {
      if (errors) {
        errors = "\\n" + this.escapeErrorString(errors);
      } else {
        errors = "";
      }

      return "describe('JSCS - " + relativePath + "', function(){\n" +
        "it('should pass jscs', function() { \n" +
        "  expect(" + !errors + ", '" + relativePath + " should pass jscs." + errors + "').to.be.ok; \n" +
        "})});\n";
    }
  }
});

if (app.env === 'test') {
  app.import(app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' });
}

module.exports = app.toTree();
