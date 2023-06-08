const deleteFile = require('./deleteFile.js');

const deleteFileInBulk = (datas) => {
    datas.forEach((data) => {
        deleteFile(data.dataValues.name);
    });
}

module.exports = deleteFileInBulk;