const CryptoJS = require('crypto-js');

const decryptData = (encryptedData) => {
  const passphrase = process.env.ENCRYPTION_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { decryptData };

const encryptData = (data: string) => {
    const passphrase = process.env.REACT_APP_ENCRYPTION_KEY;
    return CryptoJS.AES.encrypt(data, passphrase).toString();
  };
  
  export { encryptData, decryptData};