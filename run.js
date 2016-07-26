const fs = require('fs');

const { handleError, listFiles, filterOnlyImages, validateImages } = require('./utils');
const hdr = require('./hdr');
const pano = require('./pano');

const PHOTOS_DIR = '/Users/josh/Desktop/untitled folder/Pano 4 full run';

// listFiles(PHOTOS_DIR)
//   .then(filterOnlyImages)
//   .then(validateImages)
//   .then(hdr)
//   .then(pano)
//   .then(() => {
//     console.log('\nCompleted panorama!');
//   })
//   .catch((err) => {
//     console.log('got error');
//     console.log(err.stack || err);
//   });

const hdrImages  = [
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0965.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0970.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0975.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0980.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0985.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0990.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_0995.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1001.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1007.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1012.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1017.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1022.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1027.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1032.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1037.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1042.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1047.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1052.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1057.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1062.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1067.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1072.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1077.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1082.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1087.jpg',
  '/Users/josh/Desktop/untitled folder/Pano 4 full run/work/DJI_1092.jpg',
];

pano(hdrImages)
  .then(() => {
    console.log('\nCompleted panorama!');
  })
  .catch((err) => {
    console.log('got error');
    console.log(err.stack || err);
  });