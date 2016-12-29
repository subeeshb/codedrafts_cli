const fs = require('fs');
const request = require('request');
const FILE_TYPES = require('../lib/fileTypes');
const FileRecords = require('../lib/fileRecords');

module.exports = (fullPath, existingFileID, filename, author) => {
  fs.readFile(fullPath, {encoding: 'utf-8'}, (err,data) => {
    if (!err){
      let fileType = FILE_TYPES[filename.split('.').slice(-1)[0]];
      if (!fileType) {
        console.log('Unrecognized file type. Accepted file types are: \n' + JSON.stringify(Object.keys(FILE_TYPES)));
        return;
      }
      let url = null;
      if (!!existingFileID) {
        url = `${HOST}/api/files/${existingFileID}/revisions`;
      } else {
        url = `${HOST}/api/files`;
      }
      request.post({
        url, 
        form: {
          filename,
          code: data,
          language: fileType,
          author,
        },
      }, (err,httpResponse,body) => { 
        if (err) {
          console.log(err);
          return;
        }

        body = JSON.parse(body);
        if (!body.success) {
          console.log(`Upload failed: ${JSON.stringify(body.error)}`);
          return;
        }

        let uploadedURL = `${HOST}/files/${body.file_id}/${body.revision_id}`;
        console.log(`Uploaded to ${uploadedURL}`);
        require('openurl').open(uploadedURL);

        if (!existingFileID) {
          FileRecords.saveFileID(fullPath, body.file_id);
        }
      });
    }else{
      console.log(err);
    }
  });
};
