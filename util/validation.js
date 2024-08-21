const { check } = require('express-validator');
function isEmpty(value) {
  return !value || value.trim() === "";
}


async function userCredentialsAreValid(email, password) {
  // Validate email
  const emailCheck = check('email')
    .isEmail();

  // Validate password
  const passwordCheck = check('password')
    .isLength({ min: 6 });

  // Run the validations manually on the provided values
  const emailResult = await emailCheck.run({ body: { email } });
  const passwordResult = await passwordCheck.run({ body: { password } });

  // If either validation fails, return false
  if (!emailResult.isEmpty() || !passwordResult.isEmpty()) {
    return false;
  }

  // If both validations pass, return true
  return true;
}
// function userCredentialsAreValid(email, password) {

//   return email && email.includes("@") && password.trim().length >= 6
// }
function userDetailsAreValid(email, password, firstName,lastName, street, postal, city) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(firstName) &&
    !isEmpty(lastName)&&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}
function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
  userCredentialsAreValid: userCredentialsAreValid
};
