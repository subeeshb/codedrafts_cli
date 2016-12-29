# CodeDrafts CLI

> A command-line interface for uploading and downloading code snippets from CodeDrafts.

## Installation

Install the CLI globally using

```shell
$ npm install -g codedrafts
```

You will now be able to access the CLI from any folder on your system using the `codedrafts` or `drafts` command.

## Usage

To upload a file to CodeDrafts, simply use the command

```shell
$ codedrafts <filename>
```

For example,

```shell
$ codedrafts myfile.js
```

will upload `myfile.js` to CodeDrafts and display the URL that you can view the uploaded file at. You can identify yourself using the `-u` or `--username` parameter. Type `codedrafts --help` to see a full list of supported parameters and arguments.

If you've already uploaded a file, running the same command again on the file will upload it as a new revision at the existing link.

To pull the latest revision of an uploaded file from CodeDrafts, add the `--pull` or `-p` parameter:

```shell
$ codedrafts <filename> --pull
```

This will download the latest revision of the file from CodeDrafts and override your local copy.