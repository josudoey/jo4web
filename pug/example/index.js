var cons = require('consolidate');
module.exports = function (opts, cb) {
  return cons.pug("./template.pug", opts, cb);
}

