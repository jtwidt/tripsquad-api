const db = require("../models");

const Address = db.Address;
const User = db.User;

const createAddress = async (req, res) => {
  const info = req.body;

  const validUser = await User.findOne({where: {id: info.userId}});

  if (!validUser) {
    return res.status(400).send({message: "No user found."});
  }

  const address = await Address.create(info);

  return res.status(200).send({address});
};

const updateAddress = async (req, res) => {
  const id = req.params.id;
  const info = req.body;

  const address = await Address.findOne({where: {id: id}});

  if (!address) {
    return res.status(400).send({message: "No address found."});
  }

  const updatedAddress = await Address.update(info, {
    where: {id: id},
    returning: true,
    plain: true,
  });
  return res.status(200).send({address: updatedAddress[1].dataValues});
};

const getSingleAddress = async (req, res) => {
  const id = req.params.id;

  const address = await Address.findOne({where: {id: id}});

  if (!address) {
    return res.status(400).send({message: "No address found."});
  }

  return res.status(200).send({address});
};

const getAllUserAddresses = async (req, res) => {
  const {userId} = req.body;

  const addresses = await Address.findAll({where: {userId: userId}});

  return res.status(200).send({addresses});
};

const deleteAddress = async (req, res) => {
  const id = req.params.id;

  const validAddress = await Address.findOne({where: {id: id}});

  if (!validAddress) {
    return res.status(400).send({message: "No address found."});
  }

  await Address.destroy({where: {id: id}});

  return res.status(200).send({message: "Address successfully deleted."});
};

module.exports = {
  createAddress,
  updateAddress,
  getSingleAddress,
  getAllUserAddresses,
  deleteAddress,
};
