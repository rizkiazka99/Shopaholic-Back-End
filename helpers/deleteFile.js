const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const deleteFile = async (data) => {
    const path = `./${data}`;
    await unlinkAsync(path);
}

module.exports = deleteFile;