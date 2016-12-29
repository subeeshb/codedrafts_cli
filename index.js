#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  ArgumentParser,
  Const: ArgParseConst,
} = require('argparse');
const FileRecords = require('./lib/fileRecords');

const CLI = {
  push: require('./cli/push'),
  pull: require('./cli/pull'),
};

const parser = new ArgumentParser({
  version: require('./package.json').version,
  addHelp:true,
  description: 'CodeDrafts (https://codedrafts.io)',
});
parser.addArgument(
  [ 'filename' ],
  {
    help: 'Filename upload',
  }
);
parser.addArgument(
  [ '-u', '--username' ],
  {
    help: 'Username to identify yourself',
    defaultValue: 'AnonymousUser',
  }
);
parser.addArgument(
  [ '-p', '--pull' ],
  {
    help: 'Pull the latest revision of an uploaded file',
    action: 'storeTrue',
  }
);
parser.addArgument(
  [ '--beta' ],
  {
    help: ArgParseConst.SUPPRESS,
    action: 'storeTrue',
  }
);
const args = parser.parseArgs();

const fullPath = path.join(process.cwd(), args.filename);
const existingFileID = FileRecords.getFileID(fullPath);

if (args.beta) {
  console.log('Using beta version of CodeDrafts.');
  global.HOST = 'https://beta.codedrafts.io';
} else {
  global.HOST = 'https://codedrafts.io';
}

if (args.pull === true) {
  CLI.pull(fullPath, existingFileID);
} else {
  CLI.push(fullPath, existingFileID, args.filename, args.username);
}

