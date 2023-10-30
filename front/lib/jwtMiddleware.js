const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send("Access Denied");
    }

    try {
        const verified = jwt.verify(token, seon);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
};
