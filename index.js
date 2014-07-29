var path = require('path');
var fs = require('fs');
var jsonlint = require('jsonlint');

/**
 * Return the path to the mcap.json
 * @param applicationPath
 * @returns {string|URIComponents|*}
 * @private
 */
function _getMcapJsonPath(applicationPath) {
    return path.normalize(applicationPath + '/mcap.json');
}

/**
 * Check if application path is present
 * @param applicationPath
 * @param error
 * @private
 */
function _pathExists(applicationPath, error) {

    if (!fs.existsSync(applicationPath)) {
        error.ERROR_0 = module.exports.ERROR_0;
    }
}

/**
 * Check if mcap.json is present
 * @param applicationPath
 * @param error
 * @private
 */
function _mcapJsonExists(applicationPath, error) {
    if (!fs.existsSync(_getMcapJsonPath(applicationPath))) {
        error.ERROR_1 = module.exports.ERROR_1;
    }
}

/**
 * Validate the mcap.json file
 * @param applicationPath
 * @param error
 * @private
 */
function _mCAPJsonValid(applicationPath, error) {
    try {
        var mcapJson = fs.readFileSync(_getMcapJsonPath(applicationPath), 'utf-8');
        return jsonlint.parse(mcapJson);
    } catch (e) {
        error.ERROR_2 = module.exports.ERROR_2;
        error.ERROR_2.info = e;
    }
}


function _mCAPJsonRequiredFields(applicationPath, error) {
    var mcapJson = _mCAPJsonValid(applicationPath, error);
    if (mcapJson) {
        if (!mcapJson.uuid) {
            error.ERROR_3 = module.exports.ERROR_3
        }
        if (!mcapJson.name) {
            error.ERROR_4 = module.exports.ERROR_4
        }
    }
}

/**
 * Validate the given path to match all mCAP application dependencies
 * @param path
 */
function validate(applicationPath) {

    var error = {};

    _pathExists(applicationPath, error);
    _mcapJsonExists(applicationPath, error);
    _mCAPJsonValid(applicationPath, error);
    _mCAPJsonRequiredFields(applicationPath, error);

    if (Object.keys(error).length === 0) {
        return true;
    }
    return error;
}

// API

module.exports.validate = validate;

module.exports.ERROR_0 = {
    en: 'Path does not exists'
};

module.exports.ERROR_1 = {
    en: 'mcap.json is missing'
};

module.exports.ERROR_2 = {
    en: 'mcap.json is invalid'
};

module.exports.ERROR_3 = {
    en: 'mcap.json uuid is required'
};

module.exports.ERROR_4 = {
    en: 'mcap.json name is required'
};