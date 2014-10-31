
var ApplicationValidation = require('./');

var validation = new ApplicationValidation();

validation.run('./test/fixtures/passes', function(err) {
  if (err) {
    console.log(err.details.forEach);
    console.log(typeof err.details);
    return console.log(err.details);
  }
  console.log('Project is valid!');
});
