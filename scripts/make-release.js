var fs = require('fs');
var path = require('path');
var assert = require('assert');
var os = require('os');
var package = require('../package.json');
var releaseId = require('./helpers/release-id')(package.version);

// Read tag argument
var tag = process.argv.slice(2)[0] || 'untagged';
if (tag === 'untagged') {
  return;
}

// Make sure all versions match
assert(tag === 'v' + package.version, 'tag should match version');

var configKernel = path.join(__dirname, '../src/kernel/version-autogenerated.h');
assert(fs.readFileSync(configKernel, 'utf8') === String(releaseId), 'kernel version should match package version');
assert(require('../runtimecorelib.json').kernelVersion === releaseId);

// Remove { private: true } from package.json
var packageFile = path.join(__dirname, '../js/package.json');
delete package.private;
fs.writeFileSync(packageFile, JSON.stringify(package, null, 2) + os.EOL);

console.log('### tag "' + tag + '" (release #' + releaseId.toString(16) + ')');

// Write release ID
fs.writeFileSync(path.join(__dirname, '../release.tag'), [
  releaseId.toString(16),
  tag,
  new Date().toISOString()
].join(os.EOL));
