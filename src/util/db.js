// Implement the use of a Database like blockchain backup system
// Use the host machine's file system to store the current state of the blockchain

// TODO: See if I can implement the use of a system like REDIS or something (disk read/write might be too slow)

const fs = require('fs-extra');
const path = require('path');

class Db {

      constructor(filePath, defaultData) {
            this.filePath = filePath;
            this.defaultData = defaultData;
      }

      // Read from file
      read(prototype) {
            if (!fs.existsSync(this.filePath)) return this.defaultData; // Return early if the file does not exist
    
            var fileContent = fs.readFileSync(this.filePath); // Read the content from file
            if (fileContent.length == 0) return this.defaultData; // If the file is empty: return early
    
            return (prototype) ? prototype.fromJson(JSON.parse(fileContent)) : JSON.parse(fileContent); // Return found content      
      }

      // Write to file
      write(data) {
            fs.ensureDirSync(path.dirname(this.filePath)); // Ensure the file exists
            fs.writeFileSync(this.filePath, JSON.stringify(data)); // Write to file
      }
}

module.exports = Db;