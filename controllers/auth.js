const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models');

const User = db.User;

const login = async (email, password) => {
    const validEmail = await User.findOne({ where: { email: email } });
    if (!validEmail) {
        return 401;
    } else {
        const match = await bcrypt.compare(password, validEmail.password);
        if (!match) {
            return 401;
        } else {
            const jwtToken = jwt.sign(
                {
                    email: validEmail.email,
                    userId: validEmail.id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return { accessToken: jwtToken, userId: validEmail.id };
        }
    }
};

module.exports = { login };
