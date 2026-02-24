const fs = require('fs');
const sharp = require('sharp');

const src = 'src';
const dest = 'docs';
const imgSrc = `${src}/img`;
const imgDest = `${dest}/img`;
const cssDest = `${dest}/css`;
const onError = (err) => err && console.error(err);

console.log('Clearing dest folder...\n');
fs.rmSync(`${dest}`, { recursive: true, force: true });

console.log('Copying static folders & files...');
fs.cp(`${src}/404.html`, `${dest}/404.html`, onError);
fs.cp(`${src}/index.html`, `${dest}/index.html`, onError);
fs.cp(`${src}/js`, `${dest}/js`, {recursive: true}, onError);

console.log('\nCreating images dest folder...\n');
fs.mkdirSync(`${dest}/img/brand`, { recursive: true });

function generateFavicon(inFile, outFile, outFormat, resizeOpts = {}) {
  const sharpStream = sharp(`${imgSrc}/${inFile}`)
    .resize(resizeOpts)
    .toFormat(outFormat, { quality: 80 });
  return sharpStream.toFile(`${imgDest}/${outFile}.${outFormat}`, onError);
}

function processImg(fileName, format, outFormat, formatOpts = {quality: 50}, resizeOpts = {}, blur = null) {
  const sharpStream = sharp(`${imgSrc}/${fileName}.${format}`)
    .resize(resizeOpts)
    .toFormat(outFormat, formatOpts);
  if (blur) {
    sharpStream.blur(blur);
  }
  return sharpStream.toFile(`${imgDest}/${fileName}.${outFormat}`, onError);
}

console.log('Processing and optimizing images...\n');

generateFavicon('brand/logomark.svg', 'brand/favicon-16', 'png', { width: 16, height: 16 });
generateFavicon('brand/logomark.svg', 'brand/favicon-32', 'png', { width: 32, height: 32 });
generateFavicon('brand/logomark.svg', 'brand/favicon-48', 'png', { width: 48, height: 48 });
generateFavicon('brand/logomark.svg', 'brand/favicon-167', 'png', { width: 167, height: 167 });
generateFavicon('brand/logomark.svg', 'brand/favicon-180', 'png', { width: 180, height: 180 });
generateFavicon('brand/logomark.svg', 'brand/favicon-192', 'png', { width: 192, height: 192 });

processImg('brand/logo', 'png', 'webp', { quality: 50, lossless: true }, { width: 271 });
processImg('brand/logotype', 'png', 'webp', { quality: 50, lossless: true }, { width: 340 });

processImg('splash-dark', 'jpg', 'avif', { quality: 80 }, {width: 1920});
processImg('placeholder-garden', 'jpg', 'avif', { quality: 50 }, {width: 1920, height: 1080, position: 'top'}, 3);
processImg('lots-blueprint-color', 'jpg', 'avif', { quality: 50 }, {width: 1650});

processImg('render-home', 'jpg', 'avif', { quality: 50 }, {height: 700});
processImg('green-areas', 'png', 'avif', { quality: 50 }, {height: 700});
processImg('render-project-entrance', 'png', 'avif', { quality: 50 }, {height: 700});

['street', 'street-sign', 'transmission-tower', 'water-tap'].forEach((file) => {
  processImg(file, 'png', 'webp', { quality: 50, lossless: true });
});
  
console.log('Creating styles dest folder...');
fs.mkdir(cssDest, { recursive: true }, onError);
