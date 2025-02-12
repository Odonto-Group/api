import { expect } from 'chai';
import { encryptData, decryptData } from '../utils/cryptoUtils';

describe('Crypto Utils', () => {
  const originalEnv = process.env;

  before(() => {
    process.env.ENCRYPTION_KEY = 'testkey';
    process.env.REACT_APP_ENCRYPTION_KEY = 'testkey';
  });

  after(() => {
    process.env = originalEnv;
  });

  it('should read ENCRYPTION_KEY from environment variables', () => {
    expect(process.env.ENCRYPTION_KEY).to.equal('testkey');
  });

  it('should read REACT_APP_ENCRYPTION_KEY from environment variables', () => {
    expect(process.env.REACT_APP_ENCRYPTION_KEY).to.equal('testkey');
  });

  it('should encrypt and decrypt a text correctly', () => {
    const text = 'Hello, World!';
    const encryptedText = encryptData(text);
    const decryptedText = decryptData(encryptedText);

    expect(decryptedText).to.equal(text);
  });

  it('should return different encrypted text for the same input', () => {
    const text = 'Hello, World!';
    const encryptedText1 = encryptData(text);
    const encryptedText2 = encryptData(text);

    expect(encryptedText1).to.not.equal(encryptedText2);
  });
});