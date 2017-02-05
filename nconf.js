var nconf = require('nconf');
var merge = require("merge");
var _defaults = nconf.defaults.bind(nconf);
var _overrides = nconf.overrides.bind(nconf);

var checkDuplicate = function (dst, src) {
  Object.keys(src).forEach(function (key) {
    if (key in dst) {
      throw new Error("duplicate configure key.");
    }
  });
};

var defaults = function (options) {
  options = options || {};
  checkDuplicate(nconf.stores.defaults.store, options);
  merge(nconf.stores.defaults.store, options)
}

var overrides = function (options) {
  options = options || {};
  checkDuplicate(nconf.stores.overrides.store, options);
  merge(nconf.stores.overrides.store, options)
}

var patch = nconf.patch = function () {
  if (typeof nconf.stores.overrides === "undefined") {
    _overrides();
    nconf.stores.overrides.readOnly = false;
  }
  if (typeof nconf.stores.defaults === "undefined") {
    _defaults()
  }
  if (typeof nconf.stores.file === "undefined") {
    nconf.stores.file = nconf.stores.overrides;
  }

  //sort file > overrides > defaults
  var tmp = merge(true, nconf.stores);
  Object.keys(nconf.stores).forEach(function (name) {
    delete nconf.stores[name];
  });
  nconf.stores.file = tmp.file;
  nconf.stores.overrides = tmp.overrides;
  nconf.stores.defaults = tmp.defaults;
  merge(nconf.stores, tmp);
}
patch();

nconf.defaults = defaults;
nconf.overrides = overrides;
module.exports = nconf;

