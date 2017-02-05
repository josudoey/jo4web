module.exports = function (ctx) {
  if (ctx.cert && ctx.key) {
    var https = require("https");
    return https.createServer(ctx, ctx.callback());
  }
  var http = require("http");
  return http.createServer(ctx.callback());
}

