var gulp = require('gulp');
var jsonlint = require("gulp-jsonlint");
var validate = require('./tasks/validate');

var mcapManifest = require('./validators/mcapManifest.js');
var mcapModels = require('./validators/mcapModels.js');

var projectRoot = '';

var jsonLinstMessages = [];

var jsonLintReporter = function (file) {
  jsonLinstMessages.push({
    file: file.relative,
    message: file.jsonlint.message
  });
};

gulp.task('jsonlint', function(cb) {
  gulp.src('**/*.json', {cwd:projectRoot})
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

gulp.task('mcapManifest', ['jsonlint'], function(cb) {
  return gulp.src('**/*.json', {cwd:projectRoot})

    // Lint mcap manifest file
    .pipe(mcapManifest.filter)
    .pipe(validate(mcapManifest))
    // TODO create validate reporter to collect errors over several files.
    .on('error', cb)
    .pipe(mcapManifest.filter.restore());
});

gulp.task('mcapModels', ['mcapManifest'], function(cb) {
  return gulp.src('**/*.json', {cwd:projectRoot})

    // Lint mcap model file
    .pipe(mcapModels.filter)
    .pipe(validate(mcapModels))
    .on('error', cb)
    .pipe(mcapModels.filter.restore())
    ;
});

gulp.task('default', ['mcapModels']);

module.exports = function(basePath, cb) {
  projectRoot = basePath;
  gulp.run('default', function(err) {
    cb(err);
  });
};
