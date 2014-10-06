'use strict';

/*jshint expr: true*/

var mCAPApplicationValidatior = require('../');
var assert = require('should');

describe('mcapApplicationValidation', function () {

  it('programm', function () {
    mCAPApplicationValidatior.should.be.a.object;
    mCAPApplicationValidatior.validate.should.be.a.function;
  });

  it('constants', function () {
    mCAPApplicationValidatior.ERROR_0.should.be.defined;
    assert.deepEqual(mCAPApplicationValidatior.ERROR_0, {
      en: 'Path does not exists'
    });

    mCAPApplicationValidatior.ERROR_1.should.be.defined;
    assert.deepEqual(mCAPApplicationValidatior.ERROR_1, {
      en: 'mcap.json is missing'
    });

    mCAPApplicationValidatior.ERROR_2.should.be.defined;
    assert.deepEqual(mCAPApplicationValidatior.ERROR_2, {
      en: 'mcap.json is invalid'
    });

    mCAPApplicationValidatior.ERROR_3.should.be.defined;
    assert.deepEqual(mCAPApplicationValidatior.ERROR_3, {
      en: 'mcap.json uuid is required'
    });

    mCAPApplicationValidatior.ERROR_4.should.be.defined;
    assert.deepEqual(mCAPApplicationValidatior.ERROR_4, {
      en: 'mcap.json name is required'
    });
  });

  it('validate', function () {
    mCAPApplicationValidatior.validate(__dirname + '/passes/app1').should.be.true;
  });

  it('validate fail: path does not exists', function () {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/00_not_app');
    app.should.be.a.object;
    app.ERROR_0.should.be.defined;
    app.ERROR_1.should.be.defined;
    app.ERROR_2.should.be.defined;
  });

  it('validate fail: not an application', function () {

    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/01_not_app');
    app.should.be.a.object;
    app.ERROR_0.should.be.defined;
    app.ERROR_1.should.be.defined;
    app.ERROR_2.should.be.defined;
  });

  it('validate fail: mcap.json parse error', function () {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/02_mcapjson_parse_error');
    app.should.be.a.object;
    app.ERROR_2.should.be.defined;
  });

  it('validate fail: mcap.json uuid required', function () {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/03_uuid_required');
    app.should.be.a.object;
    app.ERROR_3.should.be.defined;
  });

  it('validate fail: mcap.json name required', function () {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/04_name_required');
    app.should.be.a.object;
    app.ERROR_4.should.be.defined;
  });

  it('validate fail: mcap.json uuid and name required', function () {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/05_uuid_name_required');
    app.should.be.a.object;
    app.ERROR_3.should.be.defined;
    app.ERROR_4.should.be.defined;
  });
});
