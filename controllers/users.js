const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../models');

const User = db.User;

const createUser = async (userInfo) => {
    // Destructure the given object to get the distinct values
    const {
        firstName,
        lastName,
        email,
        password,
        address1,
        address2,
        city,
        state,
        country,
        postCode,
    } = userInfo;

    // Check if the email already exists
    const validEmail = await User.findOne({ where: { email: email } });

    if (validEmail) {
        return 400;
    } else {
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            id: userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            address1,
            address2,
            city,
            state,
            country,
            postCode,
        });
        return user.dataValues;
    }
};

module.exports = {
    createUser,
};
