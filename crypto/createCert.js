var child_process = require("child_process");
var once = require('once');
var nop = function () {};
module.exports = function (ctx, cb) {
  ctx = ctx || {};
  var cmd = "sh";
  var args = ["-c", "cat|openssl req -key /dev/stdin -new -x509 -days 365 -sha256 -subj /C=TW/ST=Taiwan/L=Local/CN=localhost -out /dev/stdout|cat"];
  var promise = new Promise(function (resolve, reject) {
    var next = once(cb || function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });

    var proc = child_process.spawn(cmd, args, {
      stdio: ['pipe', 'pipe', 'ignore']
    });

    proc.stdin.write(ctx.key);
    proc.stdin.destroy();
    var stack = [];
    proc.stdout.on("data", function (buf) {
      stack.push(buf);
    });
    proc.stdout.on("close", function () {
      var result = Buffer.concat(stack).toString();
      if (result.indexOf("-----BEGIN CERTIFICATE-----") === -1) {
        return next(new Error("openssl create cert fail"));
      }
      ctx.cert = result;
      next(null, ctx);
    });
  });

  if (!cb) {
    return promise;
  }
  return ctx;
}

