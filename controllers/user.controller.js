const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.User;
const {createToken} = require("../middleware/authJwt");

const createUser = async (req, res) => {
  const {firstName, lastName, email, password} = req.body;

  const invalidEmail = await User.findOne({where: {email: email}});

  if (invalidEmail) {
    return res.status(400).send({message: "This email is already in use."});
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const tokenPayload = {
      email: user.email,
      id: user.id,
    };

    const token = createToken(tokenPayload);

    return res.status(200).send({accessToken: token, userId: user.id});
  }
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({
    where: {id: id},
  });

  if (!user) {
    return res.status(400).send({message: "No user found."});
  }
  return res.status(200).send({user});
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll({attributes: {exclude: ["password"]}});

  return res.status(200).send({users});
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const info = req.body;

  const user = await User.findOne({
    attributes: {exclude: ["createdAt", "updatedAt"]},
    where: {id: id},
  });

  if (!user) {
    return res.status(400).send({message: "No user found."});
  }

  if (info.email) {
    const invalidEmail = await User.findOne({where: {email: info.email}});

    if (invalidEmail) {
      return res.status(400).send({message: "This email is already in use."});
    }
  }

  const updatedUser = {...info};

  if (info.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(info.password, salt);
    updatedUser.password = hashedPassword;
  }

  const userInfo = await User.update(updatedUser, {
    where: {id: id},
    returning: true,
    plain: true,
  });
  return res.status(200).send({user: userInfo[1].dataValues});
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const validUser = await User.findOne({where: {id: id}});

  if (!validUser) {
    return res.status(400).send({message: "No user found."});
  }

  await User.destroy({where: {id: id}});

  return res.status(200).send({message: "User deleted"});
};

module.exports = {
  createUser,
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
