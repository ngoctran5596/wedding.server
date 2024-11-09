const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  if (token.split(" ").length !== 2 || token.split(" ")[0] !== "Bearer") {
    return res.status(403).send("Token format is invalid");
  }

  console.log("token", token);
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.username = decoded;
    console.log("Decoded user:", req.username);
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).send("Invalid Token: " + err.message);
  }

  return next();
};

module.exports = authMiddleware;
