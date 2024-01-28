const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: `This is the root route for the Flights endpoints`,
    });
});

module.exports = router;
