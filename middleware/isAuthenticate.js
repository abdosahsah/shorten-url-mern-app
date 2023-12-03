const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    // Get JWT token from header
    const token = req.header("Authorization");

    // Check if token exists
    if (!token)
      return res.status(403).json({
        success: false,
        errorMessage: "Access denied.",
      });

    // Decod JWT token
    let jwtToken = token.split(" ")[1];
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // Set user authenticate to header
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Invalid token",
    });
  }
};

module.exports = isAuth;
