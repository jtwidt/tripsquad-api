const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../public.key"),
  "utf8"
);

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

  return token;
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
