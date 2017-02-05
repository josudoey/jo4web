var child_process = require("child_process");
var once = require('once');
var nop = function () {};
module.exports = function (ctx, cb) {
  ctx = ctx || {};
  var cmd = "openssl";
  var args = ["rsa", "-in", "/dev/stdin", "-pubout", "-out", "/dev/stdout"];
  var promise = new Promise(function (resolve, reject) {
    var next = once(cb || function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });

    var proc = child_process.spawn(cmd, args, {
      stdio: ['pipe', 'pipe', 'ignore'],
      shell: false
    });

    proc.stdin.write(ctx.key);
    proc.stdin.destroy();
    var stack = [];
    proc.stdout.on("data", function (buf) {
      stack.push(buf);
    });
    proc.stdout.on("close", function () {
      var result = Buffer.concat(stack).toString();
      if (result.indexOf("-----BEGIN PUBLIC KEY-----") === -1) {
        return next(new Error("openssl create public key fail"));
      }
      ctx.public = result;
      next(null, ctx);
    });
  });

  if (!cb) {
    return promise;
  }
  return ctx;
}

