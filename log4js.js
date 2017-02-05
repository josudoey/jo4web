var _require = require;
var path = require('path');
var log4js = require('log4js');
var _getLogger = log4js.getLogger.bind(log4js);

var getCallerModulePath = function (err, depth) {
  var stack = err.stack;
  var lines = stack.split('\n');
  var line = lines[depth];
  var m = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);
  return m[2];
}

var defCategory = function () {
  var filepath = getCallerModulePath(new Error(), 3);
  var rfilepath = path.relative(__dirname, filepath);
  return rfilepath.replace(/^(\.\.\/)+/, "").replace(/.js$/, "").replace(/\//g, ".");
}

var getLogger = function (category) {
  category = category || defCategory();
  return _getLogger(category);
}
log4js.getLogger = getLogger;

var _layout = log4js.layouts.layout;
log4js.layouts.layout = function (name, config) {
  return _layout(name, config)
}
module.exports = log4js;

