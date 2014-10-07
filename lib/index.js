var path = require('path');
var fs = require('fs');
var async = require('async');
var jsonlint = require('jsonlint');
var ErrorStack = require('./errorStack');

var Validator = function () {
  this.errorStack = new ErrorStack();
};

/**
 * Check if application path is present
 * @param {string} applicationPath
 * @param {function} cb
 * @private
 */
Validator.prototype.pathExists = function (applicationPath, cb) {
  fs.readdir(applicationPath, function(err, files) {
    if (err) {
      return cb(err);
    }
    cb(null, applicationPath, files);
  });
};

/**
 * Check if mcap.json is present
 * @param {string} applicationPath
 * @param {array} files
 * @param {function} cb
 * @private
 */
Validator.prototype.mcapJsonExists = function (applicationPath, files, cb) {
  if (files.indexOf('mcap.json') === -1) {
    return cb(this.errorStack.addError('REQUIRED_FILE', 'mcap.json'));
  }
  cb(null, path.resolve(applicationPath, 'mcap.json'));
};

/**
 * Validate the mcap.json file
 * @param {string} mcapFilePath
 * @param {function} cb
 * @private
 */
Validator.prototype.readJsonFile = function (mcapFilePath, cb) {
  fs.readFile(mcapFilePath, 'utf-8', function(err, content) {
    if (err) {
      return cb(err);
    }
    cb(null, content);
  });
};

/**
 * Validate the mcap.json file
 * @param {string} content
 * @param {function} cb
 * @private
 */
Validator.prototype.mCAPJsonValid = function (content, cb) {
  try {
    content = jsonlint.parse(content);
    cb(null, content);
  } catch (e) {
    return cb(this.errorStack.addError('CORUPED_FILE', 'mcap.json'));
  }
};

/**
 * Validate the mcap.json file
 * @param {object} mcapJson
 * @param {function} cb
 * @private
 */
Validator.prototype.mCAPJsonRequiredFields = function(mcapJson, cb) {
  var requiredFields = ['uuid', 'name'];

  requiredFields.forEach(function(name) {
    if (!mcapJson[name]) {
      this.errorStack.addError('REQUIRED_VALUE', 'mcap.json', name);
    }
  }.bind(this));

  if (this.errorStack.hasErrors()) {
    return cb(this.errorStack.getErrors());
  }

  cb(null, true);
};

module.exports = Validator;

/**
 * Validate the given path to match all mCAP application dependencies
 * @param {string} applicationPath
 */
Validator.prototype.validate = function validate(applicationPath, cb) {

  async.waterfall([
    function(cb) {
      this.pathExists(applicationPath, cb);
    }.bind(this),
    this.mcapJsonExists.bind(this),
    this.readJsonFile.bind(this),
    this.mCAPJsonValid.bind(this),
    this.mCAPJsonRequiredFields.bind(this)
  ], function(err) {
    if (err) {
      return cb(err);
    }

    cb(null, true);
  });
};
