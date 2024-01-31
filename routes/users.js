const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
    createUser,
    updateUser,
    getUser,
    deleteUser,
} = require('../controllers/users');

router.get('/', (req, res) => {
    return res.status(200).send({
        message: `This is the root route for the Users endpoints`,
    });
});

router.post('/register', async (req, res) => {
    // Get the user inputs from the body of the request
    const user = req.body;
    const newUser = await createUser(user);
    if (newUser !== 400) {
        const jwtToken = jwt.sign(
            { email: newUser.email, userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res
            .status(201)
            .send({ accessToken: jwtToken, userId: newUser.id });
    } else {
        return res
            .status(400)
            .send({ message: `An account with this email already exists.` });
    }
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await getUser(userId);
    if (user === 404) {
        return res.status(404).send({ message: 'No user account found.' });
    } else {
        return res.status(200).send({ data: user });
    }
});

router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const userUpdate = req.body;
    const updatedUser = await updateUser(userId, userUpdate);
    if (updatedUser === 404) {
        return res.status(404).send({ message: 'No user account found.' });
    } else if (updatedUser === 400) {
        return res
            .status(400)
            .send({ message: 'An account with this email already exists.' });
    } else {
        return res.status(200).send({ message: 'User successfully updated.' });
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    const result = await deleteUser(userId);
    if (result === 200) {
        return res.status(200).send({ message: 'User successfully deleted.' });
    } else {
        return res.status(404).send({ message: 'Error deleting user' });
    }
});

module.exports = router;
