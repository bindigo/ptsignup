var fs = require('fs');

/*
 * Read a json file: suppose to be like:
 * {
 *   counter: 123
 * }
 */
function read_num_sync(path) {
  if (!fs.existsSync(path)) {
    throw new Error("File " + path + " does NOT exist.");
  } else {
    try {
      console.log("reading file " + path);
      var data = JSON.parse(fs.readFileSync(path, 'utf-8'));
      console.log("read data: " + JSON.stringify(data));

      // return JSON.parse(data);
      console.log("returning number: " + data.counter);
      return data.counter;
    } catch (e) {
      throw new Error(e);
    }
  }
}

function write_num_sync(path, num) {
  var tmpfile = path + ".tmp";
  var data = {};
  data.counter = num;

  try {
    console.log("writing file: " + tmpfile);
    fs.writeFileSync(tmpfile, JSON.stringify(data));

    if (fs.existsSync(path)) {
      // remove the old file
      console.log("remove file: " + path);
      fs.unlinkSync(path);
    }

    // rename the counter file
    console.log("rename file " + tmpfile + " to " + path);
    fs.renameSync(tmpfile, path);
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  read_num_sync: read_num_sync,
  write_num_sync: write_num_sync
};
