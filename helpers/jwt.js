const jwt = require('jsonwebtoken');
const secretCode = process.env.SECRETCODE;

const generateToken = (data) => {
    const { id, role } = data;

    return jwt.sign({ id, role }, secretCode);
}

const verifyToken = (token) => {
    return jwt.verify(token, secretCode);
}

module.exports = {
    generateToken,
    verifyToken
}