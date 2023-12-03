const router = require("express").Router();
const {
  signup,
  login,
  logout,
  validateToken,
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/token/validate", validateToken);

module.exports = router;
