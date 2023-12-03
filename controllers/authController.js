const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  // Check user info
  const schema = Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });

  if (schema.validate(req.body).error) {
    return res.status(400).json({
      success: false,
      errorMessage: schema.validate(req.body).error.details,
    });
  }

  // Check confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      errorMessage: "Confirm password is not same as password",
    });
  }

  // Hash password
  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(password, salt);

  // Save user info to database
  try {
    let registeredUser = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Create JWT token
    let token = await jwt.sign(
      { _id: registeredUser.id, email: registeredUser.email },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "New user is created successfully",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user;

  // Get user by email
  try {
    user = await UserModel.findOne({ email });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      success: false,
      errorMessage: "User not found please create a new account",
    });
  }

  // Compare password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({
      success: false,
      errorMessage: "Please enter valid credentials",
    });
  }

  // Create JWT token
  var token = await jwt.sign(
    { _id: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    success: true,
    message: "You are login successfully",
    token,
  });
};

const logout = async (req, res) => {
  req.user = null;
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
};

const validateToken = async (req, res) => {
  let { token } = req.body;

  if (!token)
    return res.status(403).json({
      success: false,
      errorMessage: "No token provided",
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        errorMessage: "Invalid token",
      });
    }

    if (decoded) {
      return res.status(200).json({
        success: true,
        message: "Token is valid",
      });
    }
  });
};

module.exports = {
  signup,
  login,
  logout,
  validateToken,
};
