const userService = require("./user.service");

exports.login = async (req, res) => {
    const { userId, nickname } = req.body;

    const token = await userService.loginUser(userId, nickname);

    res.json({ token });
};
