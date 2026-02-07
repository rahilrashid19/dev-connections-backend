const validator = require("validator");

const validateSignUpApi = (req) => {
  const { firstName, email, password, confirmPassword } = req;
  if (!firstName) {
    throw new Error("FirstName is required for signup");
  } else if (firstName.length < 3 || firstName.length > 15) {
    throw new Error("FirstName should be between 3 to 15 charaters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email ID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      '"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",',
    );
  }
};

module.exports = { validateSignUpApi };
