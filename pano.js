const path = require('path');

const { exec, chunk, quotePath, promise, pLog } = require('./utils');

const CELESTE_MODEL = '~/Dropbox/DRONE/data/celeste.model';

function makePtoPath(folder, name, isPto = true) {
  const fullName = isPto ? (name + '.pto') : (name);
  return quotePath(path.join(folder, fullName));
}

function generatePto(files, outputPto) {
  const quotedFiles = files.map(quotePath).join(' ');

  const command = `pto_gen ${quotedFiles} -f 81.27 -o ${outputPto}`;
  return exec(command);
}

const ivar = (name, index, value) => `${name}${index}=${value}`

function alignImages(inputPto, outputPto, images) {
  const ROW_LENGTH = 8;
  const chunked = chunk(images, ROW_LENGTH);

  const yawDegreeIteration = 360 / ROW_LENGTH;
  const pitchDegreeIteration = -30;

  const params = chunked.reduce((acc, row, rowIndex) => {
    return row.reduce((rowAcc, image, imageIndex) => {
      const imageNumber = imageIndex + (rowIndex * ROW_LENGTH);

      const yaw = (row.length === ROW_LENGTH)
        ? (imageIndex * yawDegreeIteration)
        : (imageIndex * 90);

      return rowAcc.concat(
        ivar('y', imageNumber, yaw),
        ivar('p', imageNumber, rowIndex * pitchDegreeIteration)
      );
    }, acc);
  }, []).join(',');

  return exec(`pto_var --set=${params} --output=${outputPto} ${inputPto}`);
};

module.exports = function pano(images) {
  const parsedFilename = path.parse(images[0])
  const outputPath = parsedFilename.dir;
  const out = makePtoPath.bind(null, outputPath);

  const PTO_INITIAL = out('initial');
  const PTO_ALIGNED = out('aligned');
  const PTO_CPOINTS = out('cpoints');
  const PTO_CLEANED = out('cleaned');
  const PTO_CLEAND2 = out('cleand2');
  const PTO_OPTMIZD = out('optimzd');
  const PTO_FINLCRP = out('finlcrp');
  const OUT_PARTIAL = out('partial', false);
  const OUT_PARTIAL_GLOB = out('partial*.tif', false);
  const OUT_PANORAMA = out('panorama.tif', false);

  console.log('\nCreating panorama');
  console.log(' - generating project file');

  return generatePto(images, PTO_INITIAL)
    .then(pLog(' - aligning images'))
    .then(() => alignImages(PTO_INITIAL, PTO_ALIGNED, images))

    .then(pLog(' - finding control points'))
    .then(() => exec(`cpfind --prealigned --fullscale --output=${PTO_CPOINTS} ${PTO_ALIGNED}`))

    .then(pLog(' - cleaning bad control points'))
    .then(() => exec(`celeste_standalone -i ${PTO_CPOINTS} -o ${PTO_CLEANED} -d ${CELESTE_MODEL}`))
    .then(() => exec(`cpclean --output=${PTO_CLEAND2} ${PTO_CLEANED}`))

    .then(pLog(' - optimising'))
    .then(() => exec(`autooptimiser -a -l -s -m -o ${PTO_OPTMIZD} ${PTO_CLEAND2}`))

    .then(pLog(' - setting final vars'))
    .then(() => exec(`pano_modify -o ${PTO_FINLCRP} --center --straighten --canvas=AUTO --crop=AUTO ${PTO_OPTMIZD}`))

    .then(pLog(' - rendering partials'))
    .then(() => exec(`nona -m TIFF_m -o ${OUT_PARTIAL} ${PTO_FINLCRP}`))

    .then(pLog(' - rendering final panorama'))
    .then(() => exec(`enblend -o ${OUT_PANORAMA} ${OUT_PARTIAL_GLOB}`))
}