const fs = require('fs');

const { handleError, listFiles, filterOnlyImages, validateImages } = require('./utils');
const hdr = require('./hdr');

const PHOTOS_DIR = '/Users/josh/Desktop/Pano Test Photos';

listFiles(PHOTOS_DIR)
  .then(filterOnlyImages)
  .then(validateImages)
  .then(hdr)
  .then((files) => {
    console.log(files);
  })
  .catch((err) => {
    console.log('got error');
    console.log(err.stack || err);
  });