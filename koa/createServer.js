module.exports = function (opts) {
  if (opts.cert && opts.key) {
    var https = require("https");
    return https.createServer(opts.callback());
  }
  var http = require("http");
  return http.createServer(opts.callback());
}

