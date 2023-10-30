const { User } = require("../entity");
const { generateToken } = require("../../lib/jwt");

async function loginUser(userId, nickname) {
    let user = await User.findOne({ where: { userId } });

    if (!user) {
        user = await User.create({ userId, nickname });
    }

    const token = generateToken({ userId, nickname });

    return token;
}

module.exports = { loginUser };
