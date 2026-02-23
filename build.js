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

processImg('brand/favicon', 'png', 'png', { quality: 80 }, 
  { width: 48, height: 48, fit: 'contain', background: {r:0, g:0, b:0, alpha:0} });

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
