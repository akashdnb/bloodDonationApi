require("dotenv").config(); 
const jwt = require("jsonwebtoken");

const { SECRET = "secret" } = process.env;

const isLoggedIn = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
        const payload = await jwt.verify(req.headers.authorization, SECRET);
        if (payload) {
          req.user = payload;
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = isLoggedIn;