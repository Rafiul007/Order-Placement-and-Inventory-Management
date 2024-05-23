const jwt = require("jsonwebtoken");

// Generate access token
exports.generateAccessToken = (userId, username) => {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Generate refresh token
exports.generateRefreshToken = (userId, username) => {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET_REFRESH);
};
