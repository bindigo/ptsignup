var assert = require('assert');
var ptc = require('../ptcounter');

var basedir = '/Users/garlic/workspace/tmp/ptengine_signup/new/tmpdir';
var file = basedir + '/counter.json';

var num = 1;

ptc.write_num_sync(file, num);

// start tests

assert.equal(ptc.read_num_sync(file), 1);

++num;
ptc.write_num_sync(file, num);
assert.equal(ptc.read_num_sync(file), 2);

++num;
++num;
ptc.write_num_sync(file, num);
assert.equal(ptc.read_num_sync(file), 4);
