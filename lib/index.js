var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var jsonlint = require("gulp-jsonlint");
var validate = require('./tasks/validate');

var mcapManifest = require('./validators/mcapManifest.js');
var mcapModels = require('./validators/mcapModels.js');

var ApplicationValidation = function() {
  this.jsonLinstMessages = [];
  this.validateMessages = [];
};

ApplicationValidation.prototype.setupGulp = function(projectRoot) {
  var that = this;

  var jsonLintReporter = function (file) {
    that.jsonLinstMessages.push({
      file: file.relative,
      message: file.jsonlint.message
    });
  };

  var validateReporter = function (file) {
    that.validateMessages.push({
      file: file.relative,
      message: file.validate.message
    });
  };

  gulp.task('lint', function(cb) {
    gulp.src('**/*.json', {cwd:projectRoot})

      // Lint json files
      .pipe(jsonlint())
      .pipe(jsonlint.reporter(jsonLintReporter))

      .on('end', function() {
        if (that.jsonLinstMessages.length) {
          var error = new Error();
          error.name = 'LintError';
          error.details = that.jsonLinstMessages;
          return cb(error);
        }
        cb(null);
      });
  });

  gulp.task('mcapManifest', ['lint'], function(cb) {
    gulp.src('**/*.json', {cwd:projectRoot})

      // Validate manifest file
      .pipe(mcapManifest.filter)
      .pipe(validate(mcapManifest))
      .pipe(validate.reporter(validateReporter))
      .pipe(mcapManifest.filter.restore())

      // Validate model files
      .pipe(mcapModels.filter)
      .pipe(validate(mcapModels))
      .pipe(validate.reporter(validateReporter))
      .pipe(mcapModels.filter.restore())

      .on('finish', function() {
        if (that.validateMessages.length) {
          var error = new Error();
          error.name = 'ValidateError';
          error.details = that.validateMessages;
          return cb(error);
        }
        cb(null);
      });
  });

  gulp.task('default', ['mcapManifest']);
};

ApplicationValidation.prototype.run = function(basePath, cb) {

  // Check if folder is present
  fs.stat(basePath, function(err) {
    if (err) {
      return cb(err);
    }

    // Check if folder contains a mcap.json file
    fs.stat(path.resolve(basePath, 'mcap.json'), function(err) {
      if (err) {
        if (err.code === 'ENOENT') {
          return cb(new Error('Missing mcap.json file'));
        }
        return cb(err);
      }

      this.setupGulp(basePath);
      gulp.run('default', function(err) {
        cb(err);
      });

    }.bind(this));

  }.bind(this));
};

module.exports = ApplicationValidation;
