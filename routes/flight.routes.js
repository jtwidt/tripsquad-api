const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Trip root route' });
});

module.exports = router;
