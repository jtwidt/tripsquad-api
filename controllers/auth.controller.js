const bcrypt = require('bcryptjs');

const db = require('../models');
const { createToken } = require('../middleware/authJwt');

const User = db.User;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return res.status(400).send({ message: 'Email or password incorrect.' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  console.log(validPassword);

  if (!validPassword) {
    return res.status(400).send({ message: 'Email or password incorrect.' });
  }

  const tokenPayload = {
    email: user.email,
    id: user.id,
  };

  const token = createToken(tokenPayload);

  return res.status(200).send({ accessToken: token, userId: user.id });
};

module.exports = { loginUser };
