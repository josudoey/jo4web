var path = require("path");
var cons = require('consolidate');
var fp = path.join(__dirname, "./template.pug");
module.exports = function (opts, cb) {
  return cons.pug(fp, opts, cb);
}

