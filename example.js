
var validate = require('./');

validate('./test/fixtures/02_mcapjson_parse_error/', function(err) {
  if (err) {
          console.log(err.details.forEach);
      console.log(typeof err.details);
    return console.log(err.details);
  }
  console.log(arguments);
});
