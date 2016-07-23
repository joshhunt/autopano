const fs = require('fs');
const path = require('path');

const exif = require('exif').ExifImage;
const moment = require('moment');
const async = require('async');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const exec = require('child_process').exec;

const piexif = require('./piexif.js');

const { handleError } = require('./utils');

const TIME_FORMAT = 'YYYY:MM:DD HH:mm:ss';
const OUTPUT_FOLDER = 'HDR';

function getImageMetadata(image) {
  return new Promise((resolve, reject) => {
    new exif({ image }, (err, exifData) => {
      if (err) return reject(err);

      if (!exifData.gps) {
        throw new Error('Image lacking exif data');
      }

      const createDate = moment(exifData.exif.DateTimeOriginal, TIME_FORMAT);
      const data = {
        path: image,
        creationDate: createDate.toDate(),
        rawExifData: exifData,
      }

      resolve(data);
    });
  });
}

function getMetadataForImages(images) {
  return Promise.all(images.map(getImageMetadata));
}

const getImageTime = ({ creationDate }) => creationDate.getTime()
const bracketImages = imagesData => _.values(_.groupBy(imagesData, getImageTime))

const validateBrackets = (brackets) => {
  const counted = _.groupBy(brackets, 'length');

  if (Object.keys(counted).length > 1) {
    throw new Error('Brackets are of varying lengths');
  }

  return brackets;
}

const quotePath = filePath => `"${filePath}"`

const execPromise = (command) => new Promise((resolve, reject) => {
  exec(command, (err, stdout, stderr) => {
    if (err) return reject(err);
    resolve({stdout, stderr});
  });
});

const mkdirpPromise = (dir) => new Promise((resolve, reject) => mkdirp(dir, (err) => {
  if (err) return reject(err);
  resolve();
}));

const readImage = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, (err, rawData) => {
    if (err) return reject(err);
    resolve(rawData.toString('binary'));
  });
});

const transferExif = (sourcePath, destPath) => new Promise((resolve, reject) => {
  // TODO: Optimise this to not require reading the whole file
  // to modify just the exif data
  Promise.all([readImage(sourcePath), readImage(destPath)])
    .then(([sourceFile, destFile]) => {

      const sourceExif = piexif.load(sourceFile);

      newDestExif = piexif.dump(sourceExif);
      const newDestImage = new Buffer(piexif.insert(newDestExif, destFile), 'binary');

      fs.writeFile(destPath, newDestImage, (err) => {
        if (err) return reject(err);
        resolve();
      });

    })
    .catch(reject);
});

const wait = (dur) => new Promise((resolve) => setTimeout(resolve, dur))

const renderBracket = (bracket, cb) => {
  const files = _.map(bracket, 'path')
  const quotedFiles = files.map(quotePath);

  const parsedFilename = path.parse(files[0])
  const outputFilename = parsedFilename.name + '.jpg';
  const outputFolder = path.join(parsedFilename.dir, OUTPUT_FOLDER);
  const outputPath = path.join(outputFolder, outputFilename);
  const outputPathQuoted = quotePath(outputPath);

  const enfuseCommand = [
    'enfuse',
    '--compression=100',
    `--output=${outputPathQuoted}`,
    quotedFiles.join(' '),
  ].join(' ');

  console.log(`Started ${outputFilename}`);

  mkdirpPromise(outputFolder)
    .then(() => execPromise(enfuseCommand))
    .then(() => wait(500))
    .then(() => transferExif(files[0], outputPath))
    .then(() => cb(null, outputPath))
    .catch(cb)

};

const renderBrackets = (brackets) => new Promise((resolve, reject) => {
  console.log('Rendering', brackets.length, 'brackets');

  async.mapLimit(brackets, 4, renderBracket, (err, results) => {
    if (err) return reject(err);
    console.log('All done!');

    resolve(results);
  });
});

module.exports = (images) => {
  return getMetadataForImages(images)
    .then(bracketImages)
    .then(validateBrackets)
    .then(renderBrackets);
};