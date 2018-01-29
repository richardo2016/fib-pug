/**
 * only test in fibjs 0.21 and pug@2.0.0-rc.4
 *
 */
const vm = require('vm');
const sbox = new vm.SandBox({
  fs: require('fs'),
  path: require('path'),
  http: require('http'),
  https: require('http'),
  assert: require('assert'),
  url: require('url'),
  os: require('os'),
  util: require('util')
});

const pug = sbox.require('pug', __filename)

module.exports = pug
