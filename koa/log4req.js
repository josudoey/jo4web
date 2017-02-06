module.exports = function (logger) {
  if (!logger) {
    var log4js = require("../log4js");
    logger = log4js.getLogger();
  }
  return function* (next) {
    var remote = this.remote = this.socket.remoteAddress;
    var x = this.headers["x-forwarded-for"];
    if (x) {
      this.proxy = remote;
      this.remote = x.split(",")[0];
      remote = this.remote;
    }
    var t = Date.now();
    var self = this;
    this.res.on('finish', function () {
      var dt = Date.now() - t;
      logger.info(remote, "-", self.method, self.path, self.response.status, "time:" + dt);
    });
    yield next;
  };
}

