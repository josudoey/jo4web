var child_process = require("child_process");
var once = require('once');
var nop = function () {};
module.exports = function (ctx, cb) {
  ctx = ctx || {};
  var bits = ctx.bits || 2048;
  var cmd = "openssl";
  var args = ["genrsa", bits];
  var promise = new Promise(function (resolve, reject) {
    var next = once(cb || function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });

    var proc = child_process.spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'ignore']
    });
    var stack = [];
    proc.stdout.on("data", function (buf) {
      stack.push(buf);
    });
    proc.stdout.on("close", function () {
      var key = Buffer.concat(stack).toString();
      if (key.indexOf("-----BEGIN RSA PRIVATE KEY-----") === -1) {
        return next(new Error("openssl create rsa private key fail"));
      }
      ctx.private = key;
      next(null, ctx);
    });
  });

  if (!cb) {
    return promise;
  }
  return ctx;
}

