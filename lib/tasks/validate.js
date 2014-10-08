
var _ = require('lodash');
var Joi = require('joi');
var mapStream = require('map-stream');

module.exports = function(jobDescription) {
  return mapStream(function (file, cb) {
    var content = null;

    console.log('run validate for: ', file.relative);

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
        return cb(err);
      }
      cb(null, file);
    });
  });
};
