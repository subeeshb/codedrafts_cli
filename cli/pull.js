const fs = require('fs');
const request = require('request');
const readline = require('readline');

module.exports = (fullPath, existingFileID) => {
  if (!existingFileID) {
    console.log('This file doesn\'t seem to have been uploaded yet.');
    return;
  }

  const revisionsURL = `${HOST}/api/files/${existingFileID}/revisions`;
  request.get({
    url: revisionsURL,
  }, (err,httpResponse,body) => { 
    if (err) {
      console.log(err);
      return;
    }

    body = JSON.parse(body);
    if (!body.success) {
      console.log(`Failed to get revisions for file: ${JSON.stringify(body.error)}`);
      return;
    }

    let revisions = body.revisions;
    if (revisions.length === 0) {
      console.log('Didn\'t find any revisions for this file.');
      return;
    }

    const latestRevision = revisions[0].revision_id;
    const latestRevisionURL = `${HOST}/api/files/${existingFileID}/revisions/${latestRevision}`;
    request.get({
      url: latestRevisionURL,
    }, (err,httpResponse,body) => { 
      if (err) {
        console.log(err);
        return;
      }

      body = JSON.parse(body);
      if (!body.success) {
        console.log(`Failed to get revisions for file: ${JSON.stringify(body.error)}`);
        return;
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Are you sure you want to overwrite the file with the latest revision? (y/n) > ', (answer) => {
        answer = answer.toLowerCase();
        if (answer !== 'y') {
          console.log('Cancelling. The file wasn\'t modified.');
          return;
        }

        rl.close();

        fs.truncate(fullPath, 0, function() {
          fs.writeFile(fullPath, body.code, function (err) {
            if (err) {
                return console.log('Error writing file: ' + err);
            }

            console.log(`Updated file to the latest revision by ${body.author}.`)
          });
        });
      });
    });
  });
};
