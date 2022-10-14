// ref:
// https://github.com/mdn/dom-examples/blob/main/web-crypto/derive-key/pbkdf2.js
// https://bradyjoslin.com/blog/encryption-webcrypto/

export function generateKeyFromPassword (password) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2'}, false, ['deriveBits', 'deriveKey']);
}

export function generateAESGCM256Key (keyMaterial, salt) {
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'sha-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export function encryptPlainText(password, textValue, callback) {
  if (!textValue || textValue.length === 0) {
    callback({ encrypted: [], salt: [], iv: [] });
    return;
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  generateKeyFromPassword(password).then((keyMaterial) => {
    generateAESGCM256Key(keyMaterial, salt).then((key) => {

      crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(textValue)).then((cipherText) => {
        const arrayEncrypted = Array.from(new Uint8Array(cipherText));
        const arraySalt = Array.from(new Uint8Array(salt));
        const arrayIv = Array.from(new Uint8Array(iv));

        callback({ encrypted: arrayEncrypted, salt: arraySalt, iv: arrayIv });

      });
    });
  });
}

export function decryptArrayValue (password, { arrayEncrypted, arraySalt, arrayIv }, callback) {
  if (!arrayEncrypted || !arrayEncrypted.length) {
    callback('');
    return;
  }

  generateKeyFromPassword(password).then((keyMaterial) => {
    const salt = Uint8Array.from(arraySalt);
    generateAESGCM256Key(keyMaterial, salt).then((key) => {

      const iv = Uint8Array.from(arrayIv);
      const theEncryptedText = Uint8Array.from(arrayEncrypted);

      crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, theEncryptedText).then((decrypted) => {
        callback(new TextDecoder().decode(decrypted));
      }).catch((err) => {
        console.log('err crypto.subtle.decrypt:', err);
      });

    }).catch((err) => {
      console.log('err generateAESGCM256Key:', err);
    });
  }).catch((err) => {
    console.log('err generateKeyFromPassword:', err);
  });
}
