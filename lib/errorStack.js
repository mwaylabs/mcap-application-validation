
var util = require('util');

var errors = {
  REQUIRED_VALUE: 'Value \'%s\' is required',
  REQUIRED_FILE: 'File \'%s\' is required',
  CORUPED_FILE: 'File \'%s\' is coruped',
};

var ErrorStack = function() {
  this._errorStack = [];
};

module.exports = ErrorStack;

/**
 * Returns true if an error was detected, otherwise false
 * @return {Boolean}
 */
ErrorStack.prototype.hasErrors = function () {
  return this._errorStack.length > 0;
};

/**
 * Get all the stored errors. The returned error object
 * have an property 'errors' {Array} wich contains all
 * validaton errors in the following format:
 * {
 *   code: 'REQUIRED_VALUE',
 *   file: 'mcap.json',
 *   property: 'uuid',
 *   message: Value uuid is required
 * }
 * @return {Error}
 */
ErrorStack.prototype.getErrors = function () {

  var err = new Error('Validation Error');
  err.errors = this._errorStack;
  return err;
};

/**
 * Add a validation error to the stack
 * @param {String} code  The Error constant which describes the error
 * @param {String} file  The effected filename
 * @param {String} property The effected property name
 * @return {Error} See getErrors() description.
 */
ErrorStack.prototype.addError = function addError (code, file, property) {
  var err = {
    code: code,
    file: file,
    property: property || '',
    message: util.format(errors[code], property || file)
  };

  if (err) {
    this._errorStack.push(err);
  }

  return this.getErrors();
};
