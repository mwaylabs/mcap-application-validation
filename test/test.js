'use strict';

/*jshint expr: true*/

var mCAPValidatior = require('../');
var mCAPApplicationValidatior = null;
require('should');

describe('mcapApplicationValidation', function () {

  beforeEach(function() {
    mCAPApplicationValidatior = new mCAPValidatior();
  });

  it('validate', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/passes/app1', function(err, valid) {
      (err === null).should.be.true;
      valid.should.be.true;
      cb();
    });
  });

  it('validate fail: path does not exists', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/00_not_app', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errno.should.equal(34);
      cb();
    });
  });

  it('validate fail: not an application', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/01_not_app', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errors.should.be.defined;
      err.errors.should.be.an.instanceOf(Array);
      err.errors.should.be.a.lengthOf(1);
      err.errors[0].code.should.equal('REQUIRED_FILE');
      err.errors[0].file.should.equal('mcap.json');
      cb();
    });
  });

  it('validate fail: mcap.json parse error', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/02_mcapjson_parse_error', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errors.should.be.defined;
      err.errors.should.be.an.instanceOf(Array);
      err.errors.should.be.a.lengthOf(1);

      err.errors[0].code.should.equal('CORUPED_FILE');
      err.errors[0].file.should.equal('mcap.json');
      cb();
    });
  });

  it('validate fail: mcap.json uuid required', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/03_uuid_required', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errors.should.be.defined;
      err.errors.should.be.an.instanceOf(Array);
      err.errors.should.be.a.lengthOf(1);

      err.errors[0].code.should.equal('REQUIRED_VALUE');
      err.errors[0].file.should.equal('mcap.json');
      err.errors[0].property.should.equal('uuid');

      cb();
    });
  });

  it('validate fail: mcap.json name required', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/04_name_required', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errors.should.be.defined;
      err.errors.should.be.an.instanceOf(Array);
      err.errors.should.be.a.lengthOf(1);

      err.errors[0].code.should.equal('REQUIRED_VALUE');
      err.errors[0].file.should.equal('mcap.json');
      err.errors[0].property.should.equal('name');

      cb();
    });
  });

  it('validate fail: mcap.json uuid and name required', function (cb) {
    mCAPApplicationValidatior.validate(__dirname + '/fails/05_uuid_name_required', function(err) {
      err.should.be.defined;
      err.should.be.an.instanceOf(Error);
      err.errors.should.be.defined;
      err.errors.should.be.an.instanceOf(Array);
      err.errors.should.be.a.lengthOf(2);

      err.errors[0].code.should.equal('REQUIRED_VALUE');
      err.errors[0].file.should.equal('mcap.json');
      err.errors[0].property.should.equal('uuid');

      err.errors[1].code.should.equal('REQUIRED_VALUE');
      err.errors[1].file.should.equal('mcap.json');
      err.errors[1].property.should.equal('name');
      cb();
    });
  });
});
