const db = require('../models');

const User = db.User;

// CREATE A USER
const createUser = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { clerkId } = req.auth;

  // Searches the database for a user with the given Clerk ID, creates the user if none found.
  const [user, created] = await User.findOrCreate({
    where: { clerkId },
  });

  // Send an error message if a user was already found or success if the user was created
  if (!created) {
    return res.status(400).send({ message: 'User already exists' });
  }

  return res.status(201).send({ user });
};

// GET LOGGED IN USER
const getLoggedInUser = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { clerkId } = req.auth;

  // Find the user based on the Clerk ID
  const user = await User.findOne({ where: { clerkId } });

  // Return an error if the user isn't found
  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  // Return the found user
  return res.status(200).send({ user });
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await User.findAll({});

  return res.status(200).send({ users });
};

// UPDATE A USER

// DELETE A USER
const deleteUser = async (req, res) => {
  // Get the Clerk userID added by the Clerk middleware
  const { clerkId } = req.auth;

  // Ensure that the user exists and send an error message if not found
  const validUser = await User.findOne({ where: { clerkId } });

  // Return a message stating that the user was not found
  if (!validUser) {
    return res.status(400).send({ message: 'No user found.' });
  }

  // Delete the user and send a success message once complete
  await User.destroy({ where: { clerkId } });

  return res.status(200).send({ message: 'User deleted' });
};

module.exports = {
  createUser,
  getLoggedInUser,
  getAllUsers,
  deleteUser,
};
