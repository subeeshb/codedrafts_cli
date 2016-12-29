'use strict';

const fs = require('fs');

const FILENAME = 'history.json';

module.exports = {
  saveFileID(filePath, fileID) {
    let data = this._loadData();
    data[filePath] = fileID;
    fs.writeFile(`${__dirname}/${FILENAME}`, JSON.stringify(data));
  },

  getFileID(filePath) {
    let data = this._loadData();
    return data[filePath];
  },

  _loadData() {
    if (!fs.existsSync(`${__dirname}/${FILENAME}`)) {
      return {};
    }

    let data = fs.readFileSync(`${__dirname}/${FILENAME}`);
    return JSON.parse(data);
  },
};
