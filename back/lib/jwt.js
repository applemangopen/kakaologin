const jwt = require("jsonwebtoken");

function generateToken(payload) {
    return jwt.sign(payload, "seon", { expiresIn: "1h" });
}

function verifyToken(token) {
    return jwt.verify(token, "seon");
}

module.exports = { generateToken, verifyToken };
