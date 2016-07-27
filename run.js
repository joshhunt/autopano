const fs = require('fs');

const { handleError, listFiles, filterOnlyImages, validateImages } = require('./utils');
const hdr = require('./hdr');
const pano = require('./pano');

const PHOTOS_DIR = '/Users/josh/Desktop/untitled folder/Pano 4 full run';

listFiles(PHOTOS_DIR)
  .then(filterOnlyImages)
  .then(validateImages)
  .then(hdr)
  .then(pano)
  .then(() => {
    console.log('\nCompleted panorama!');
  })
  .catch((err) => {
    console.log('got error');
    console.log(err.stack || err);
  });
