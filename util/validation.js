function isEmpty(value) {
  return !value || value.trim() === "";
}
function userCredentialsAreValid(email, password) {
  return email && email.includes("@") && password.trim().length >= 6;
}
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
};
