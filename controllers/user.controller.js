const db = require('../models');

const User = db.User;

// CREATE A USER
const createUser = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { userId } = req.auth;

  // Searches the database for a user with the given Clerk ID, creates the user if none found.
  const [user, created] = await User.findOrCreate({
    where: { clerkId: userId },
  });

  // Send an error message if a user was already found or success if the user was created
  if (!created) {
    return res.status(400).send({ message: 'User already exists' });
  }

  return res.status(200).send({ user });
};

// GET A SINGLE USER

// GET ALL USERS

// UPDATE A USER

// DELETE A USER

module.exports = {
  createUser,
};
