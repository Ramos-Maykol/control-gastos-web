const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generarSal = () => crypto.randomBytes(16).toString('hex');

const encriptarPassword = (password, sal) => {
    return crypto.pbkd2Sync(password, sal, 1000, 64, 'sha512').toString('hex');
};

const generarTokenAcceso = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const generarTokenRefresh = () => {
    return crypto.randomBytes(40).toString('hex');
};

module.exports = {
    generarSal,
    encriptarPassword,
    generarTokenAcceso,
    generarTokenRefresh
};
