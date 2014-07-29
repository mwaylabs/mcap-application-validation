'use strict';

var tap = require('tap');
var mCAPApplicationValidatior = require('../index');

tap.test('programm', function (t) {
    t.ok(mCAPApplicationValidatior, "object loaded");
    t.ok(mCAPApplicationValidatior.validate, "function present");
    t.end();
});

tap.test('constants', function (t) {
    t.ok(mCAPApplicationValidatior.ERROR_0);
    t.deepEqual(mCAPApplicationValidatior.ERROR_0, {
        en: 'Path does not exists'
    });

    t.ok(mCAPApplicationValidatior.ERROR_1);
    t.deepEqual(mCAPApplicationValidatior.ERROR_1, {
        en: 'mcap.json is missing'
    });

    t.ok(mCAPApplicationValidatior.ERROR_2);
    t.deepEqual(mCAPApplicationValidatior.ERROR_2, {
        en: 'mcap.json is invalid'
    });

    t.ok(mCAPApplicationValidatior.ERROR_3);
    t.deepEqual(mCAPApplicationValidatior.ERROR_3, {
        en: 'mcap.json uuid is required'
    });

    t.ok(mCAPApplicationValidatior.ERROR_4);
    t.deepEqual(mCAPApplicationValidatior.ERROR_4, {
        en: 'mcap.json name is required'
    });
    t.end();
});

tap.test('validate', function (t) {
    t.equal(mCAPApplicationValidatior.validate(__dirname + '/passes/app1'), true);
    t.end();
});

tap.test('validate fail: path does not exists', function (t) {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/00_not_app');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_0);
    t.ok(app.ERROR_1);
    t.ok(app.ERROR_2);
    t.end();
});

tap.test('validate fail: not an application', function (t) {

    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/01_not_app');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_1);
    t.ok(app.ERROR_2);
    t.end();
});

tap.test('validate fail: mcap.json parse error', function (t) {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/02_mcapjson_parse_error');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_2);
    t.end();
});

tap.test('validate fail: mcap.json uuid required', function (t) {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/03_uuid_required');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_3);
    t.end();
});

tap.test('validate fail: mcap.json name required', function (t) {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/04_name_required');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_4);
    t.end();
});

tap.test('validate fail: mcap.json uuid and name required', function (t) {
    var app = mCAPApplicationValidatior.validate(__dirname + '/fails/05_uuid_name_required');
    t.equal(typeof app, 'object');
    t.ok(app.ERROR_3);
    t.ok(app.ERROR_4);
    t.end();
});