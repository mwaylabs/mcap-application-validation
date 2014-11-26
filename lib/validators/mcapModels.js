var gulpFilter = require('gulp-filter');
var Joi = require('joi');

module.exports = {
  filter: gulpFilter('models/*.json'),
  schema: Joi.object().keys({
    name: Joi.string().required().alphanum().min(3).max(30),
    label: Joi.string().required().alphanum().min(3).max(30),
    attributes: Joi.array().required()
  }),
  options: {
    allowUnknown: false
  }
};
