
var validate = require('./');

validate('./test/passes/app1/', function(err) {
  console.log('===========================');
  if (err) {
    return console.log(err);
  }
  console.log(arguments);
});
