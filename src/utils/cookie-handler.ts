import dotenv from 'dotenv';
import crypto, { BinaryLike } from 'crypto';

const encryptCookie = (cookie: string, key: crypto.CipherKey) => {
    const iv = crypto.randomBytes(16);
    const chipper = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrytedData = chipper.update(cookie, 'utf-8', 'hex');
    encrytedData += chipper.final('hex');
    console.log(chipper.getAuthTag());
    return JSON.stringify({
        content: encrytedData.toString(),
        tag: chipper.getAuthTag().toString('hex'),
        iv: iv.toString('hex'),
    });
};

const decryptCookie = (encryptedCookie: any, key: crypto.CipherKey) => {
    const enctyptedObject = JSON.parse(encryptedCookie);
    const prefix = encryptedCookie.slice(0, 3); // prefix
    const iv = enctyptedObject.iv; // 16 bytes nonce
    const ciphertext = enctyptedObject.content; // encrypted cookie
    const authTag = enctyptedObject.tag;
    console.log(authTag); // 12 bytes authentication tag
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    console.log(
        decipher, // decipher.setAuthTag(authTag as Buffer)
        Buffer.from(authTag, 'hex')
    );
    const authTage = decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    console.log(authTage);
    return Buffer.concat([
        decipher.update(Buffer.from(ciphertext, 'hex')), // encrypted cookie
        decipher.final(),
    ]);
};

//Encryption
export const createCookie = (cookieData: string) => {
    return encryptCookie(
        cookieData,
        Buffer.from(process.env.ENCRYPTION_KEY as string)
    );
};

// Decryption
export const getCookie = (encryptedCookie: string | Buffer) => {
    return decryptCookie(
        encryptedCookie,
        process.env.ENCRYPTION_KEY as string
    ).toString('utf-8');
};
