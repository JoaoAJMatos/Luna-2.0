// Digital signatures module | Luna 2.0

// This module takes care of all the elliptic curve cryptography cool stuff
// It:
//   - Generates a 512-bit secret from a given password
//   - Generates a key pair from a given secret
//   - Signs an incoming hash given a keypair (used for signing transactions)
//   - Verifies a signature given a PK, a signature and a hash (used for validating the authenticity of a transaction)
 
const crypto = require('crypto');
const elliptic = require('elliptic');
const EdDSA = elliptic.eddsa;
const ec = new EdDSA('ed25519');

const SALT = '970ec274ca867815174ebe4eff19282000f9495a6c7254e94991d1fb4dc3df30' // 256 bits of random gibberish

class CryptoEdDSAUtil {

      // Generate a secret based on a password
      static generateSecret(password) {
            let secret = crypto.pbkdf2Sync(password, SALT, 10000, 512, 'sha512').toString('hex');
            console.debug(`Secret: ${secret}`);
            return secret;
      }

      // Generate a key pair from a secret
      static generateKeyPairFromSecret(secret) {
            let keyPair = ec.keyFromSecret(secret); // Takes a hex string, array or buffer
            console.debug(`Public key: ${elliptic.utils.toHex(keyPair.getPublic())}`);
            return keyPair;
      }

      // Sign incoming hashes
      static signHash(keyPair, hash) {
            let signature = keyPair.sign(hash).toHex().toLowerCase();
            console.debug(`Signature: ${signature}`);
            return signature;
      }

      // Signature verifier 
      static verifySignature(publicKey, signature, hash) {
            let key = ec.keyFromPublic(publicKey, 'hex');
            let verified = key.verify(hash, signature);
            console.debug(`Verified: ${verified}`);
            return verified;
      }

      // Helper function to convert string of bytes to hex
      static toHex(data) {
            return elliptic.utils.toHex(data);
      }
}

module.exports = CryptoEdDSAUtil;