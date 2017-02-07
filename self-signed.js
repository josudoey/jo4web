var forge = require('node-forge');
var gererateSerialNumber = function () {
  var sn = forge.util.bytesToHex(forge.random.getBytesSync(9));
  if (sn.match(/^[0-7]/)) {
    return sn;
  }

  // ref http://www.ietf.org/rfc/rfc5280.txt
  // For section 4.1.2.2. Serial Number
  // CAs MUST force the serialNumber to be a non-negative integer.
  var n = parseInt(sn[0], 16) - 8;
  return n.toString() + sn.substring(1);
}

module.exports = function (ctx) {
  ctx = ctx || {};
  var keyPair = forge.pki.rsa.generateKeyPair(512);
  var cert = forge.pki.createCertificate();
  cert.serialNumber = gererateSerialNumber();
  var now = Date.now();
  var after = now + 365 * 24 * 60 * 60000
  cert.validity.notBefore = new Date(now);
  cert.validity.notAfter = new Date(after);
  var attrs = [{
    name: 'commonName',
    value: 'localhost'
  }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.publicKey = keyPair.publicKey;
  var md = forge.md.sha256.create();
  cert.sign(keyPair.privateKey, md);

  ctx.key = forge.pki.privateKeyToPem(keyPair.privateKey);
  ctx.cert = forge.pki.certificateToPem(cert);
  return ctx;
}

