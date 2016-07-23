const fs = require('fs');
const path = require('path');
const IMAGE_REGEX = /\d\.JE?PG$/i;

const BRACKET_LENGTH = 3;
const TARGET_NUM_IMAGES = (8 + 8 + 8 + 2) * BRACKET_LENGTH; // three rows of 8, plus two at the nadir

module.exports = {
  handleError: (err) => {
    if (!err) return;

    console.log(err);
    process.exit(1);
  },


  listFiles: (dir) => new Promise((resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) reject(err);
      const filesWithPath = data.map( filename => path.join(dir, filename) );
      resolve(filesWithPath);
    });
  }),


  filterOnlyImages: (allFiles) => allFiles.filter((filename) => IMAGE_REGEX.test(filename) ),

  validateImages: (images) => new Promise((resolve, reject) => {
    if (images.length !== TARGET_NUM_IMAGES) {
      return reject(new Error(`Expected ${targetNumberOfImages} images, found ${images.length}`));
    }

    resolve(images);
  }),
}