const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  } else {
    console.log(`Directory does not exist: ${directoryPath}`);
  }
}

// Path to the lib directory (relative to the project root)
const libDirectory = path.join(__dirname, '..', 'lib');

// Delete the lib directory
console.log('Cleaning lib directory...');
deleteFolderRecursive(libDirectory);
console.log('Clean completed.');
