const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { createUser } = require('../controllers/users');

router.get('/', (req, res) => {
    res.status(200).send({
        message: `This is the root route for the Users endpoints`,
    });
});

router.post('/register', async (req, res) => {
    // Get the user inputs from the body of the request
    const user = req.body;
    const newUser = await createUser(user);
    if (newUser !== 400) {
        console.log(newUser);
        const jwtToken = jwt.sign(
            { email: newUser.email, userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res
            .status(200)
            .send({ accessToken: jwtToken, userId: newUser.id });
    } else {
        return res
            .status(400)
            .send({ message: `An account with this email already exists.` });
    }
});

module.exports = router;
