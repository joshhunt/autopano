const fs = require('fs');
const path = require('path');
const childProcessExec = require('child_process').exec;

const IMAGE_REGEX = /\d\.JE?PG$/i;

const BRACKET_LENGTH = 5;
const TARGET_NUM_IMAGES = (8 + 8 + 8 + 2) * BRACKET_LENGTH; // three rows of 8, plus two at the nadir

const promise = (func) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      func(...args, resolve, reject);
    })
  }
}

module.exports = {

  promise: promise,

  handleError: (err) => {
    if (!err) return;

    console.log(err);
    process.exit(1);
  },

  listFiles: promise((dir, resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) reject(err);
      const filesWithPath = data.map( filename => path.join(dir, filename) );
      resolve(filesWithPath);
    });
  }),

  filterOnlyImages(allFiles) {
    return allFiles.filter((filename) => IMAGE_REGEX.test(filename))
  },

  validateImages(images) {
    if (images.length !== TARGET_NUM_IMAGES) {
      throw new Error(`Expected ${TARGET_NUM_IMAGES} images, found ${images.length}`);
    }

    return images;
  },

  exec: promise((command, resolve, reject) => {
    childProcessExec(command, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({stdout, stderr});
    });
  }),

  quotePath: filePath => `"${filePath}"`,

  pLog(...msg) {
    return (arg) => {
      console.log(...msg);
      return arg
    }
  },

  chunk(arr, len) {
    let chunks = [];
    let i = 0;
    let n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }

    return chunks;
  }
}