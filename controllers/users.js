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

const getUser = async (userId) => {
    const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: userId,
        },
    });
    if (user) {
        return user;
    } else {
        return 404;
    }
};

const updateUser = async (userId, userInfo) => {
    let validEmail;
    const validId = await User.findOne({
        where: {
            id: userId,
        },
    });

    if (validId) {
        if (userInfo.email) {
            validEmail = await User.findOne({
                where: {
                    email: userInfo.email,
                },
            });

            if (validEmail) {
                return 400;
            }
        }

        const updatedUser = await User.update(userInfo, {
            where: { id: userId },
        });
        return updatedUser;
    } else {
        return 404;
    }
};

const deleteUser = async (userId) => {
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
        await User.destroy({ where: { id: userId } });
        return 200;
    } else {
        return 404;
    }
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
};
