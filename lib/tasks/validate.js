
var _ = require('lodash');
var gutil = require('gulp-util');
var c = gutil.colors;
var Joi = require('joi');
var mapStream = require('map-stream');

var Validate = function(jobDescription) {
  return mapStream(function (file, cb) {
    var content = null;

    try {
      content = JSON.parse(String(file.contents));
    } catch (err) {
      return cb(err);
    }

    var options = {
      abortEarly: false
    };

    _.defaults(options, jobDescription.options);

    Joi.validate(content, jobDescription.schema, options, function (err) {
      if (err) {
        file.validate = err;
        file.validate.success = false;
      }
      cb(null, file);
    }.bind(this));
  });
};

var defaultReporter = function(file) {
  gutil.log(c.yellow('Error on file ') + c.magenta(file.path));
  gutil.log(c.red(file.validate));
};

Validate.reporter = function (customReporter) {
  var reporter = defaultReporter;

  if (typeof customReporter === 'function') {
    reporter = customReporter;
  }

  return mapStream(function (file, cb) {
    if (file.validate && !file.validate.success) {
      reporter(file);
    }
    return cb(null, file);
  });
};

module.exports = Validate;
