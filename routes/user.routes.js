const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const {
  createUser,
  getLoggedInUser,
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/user.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Users root route' });
});

router.post(
  '/register',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  createUser
);
router.get(
  '/me',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getLoggedInUser
);
router.get(
  '/all',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getAllUsers
);
router.delete(
  '/delete',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  deleteUser
);
router.patch(
  '/update',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  updateUser
);

module.exports = router;
