var gulp = require('gulp');
var jsonlint = require("gulp-jsonlint");
var validate = require('./tasks/validate');

var mcapManifest = require('./validators/mcapManifest.js');
var mcapModels = require('./validators/mcapModels.js');

var projectRoot = '';

var jsonLinstMessages = [];
var validateMessages = [];

var jsonLintReporter = function (file) {
  jsonLinstMessages.push({
    file: file.relative,
    message: file.jsonlint.message
  });
};

var validateReporter = function (file) {
  validateMessages.push({
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
      if (jsonLinstMessages.length) {
        var error = new Error();
        error.name = 'LintError';
        error.details = jsonLinstMessages;
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
      if (validateMessages.length) {
        var error = new Error();
        error.name = 'ValidateError';
        error.details = validateMessages;
        return cb(error);
      }
      cb(null);
    });
});

gulp.task('default', ['mcapManifest']);

module.exports = function(basePath, cb) {
  projectRoot = basePath;
  gulp.run('default', function(err) {
    cb(err);
  });
};
