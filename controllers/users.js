const db = require('../models');

const User = db.users;

const createUser = async (userInfo) => {
    const user = await User.create(userInfo);
    console.log(user.id);
};

module.exports = {
    createUser,
};
