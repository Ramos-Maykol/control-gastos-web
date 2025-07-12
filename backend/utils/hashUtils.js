import crypto from 'crypto';

export const generarSalt = () => crypto.randomBytes(32).toString('hex');

export const hashearPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

export const verificarPassword = (inputPassword, hashedPassword, salt) => {
  const hashInput = hashearPassword(inputPassword, salt);
  return hashedPassword === hashInput;
};
