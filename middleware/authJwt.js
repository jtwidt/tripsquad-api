const fs = require("fs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const privateKey = fs.readFileSync("../private.key", {encoding: "utf8"});
const publicKey = fs.readFileSync("../public.key", {encoding: "utf8"});

const signOptions = {
  expiresIn: "1h",
  algorithm: "RS256", // RSASSA [ "RS256", "RS384", "RS512" ]
};

const verifyOptions = {
  expiresIn: "1h",
  algorithm: ["RS256"],
};

const createToken = (payload) => {
  const token = jwt.sign(payload, privateKey, signOptions);

  return createToken;
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(token, publicKey, verifyOptions);
      req.userData = decoded;
      next();
    }
  } catch (error) {
    return res.status(401).send({message: "Authentication failed"});
  }
};

const authJwt = {
  verifyToken: verifyToken,
  createToken: createToken,
};

module.exports = authJwt;
