const crypto =  require('crypto');

class CryptoUtil {
      // Sha256 calculator
      static hash(any) {
            // Check if the argument passed is an object, if it is, convert to string
            let anyString = typeof (any) == 'object' ? JSON.stringify(any) : any.toString(); 
            return crypto.createHash('sha256').update(anyString).digest('hex'); // Return SHA256 hash
      }

      // Random ID generator
      // TODO: See if I can implement the use of uuid here 
      static randomID(size = 64) {
            return crypto.randomBytes(Math.floor(size / 2)).toString('hex');
      }
}

module.exports = CryptoUtil;