const sharp = require('sharp');
const fs = require('fs');
const src = 'src';
const dest = 'docs';
const imgSrc = `${src}/img`;
const imgDest = `${dest}/img`;
const cssDest = `${dest}/css`;

console.log('Clearing dest files...\n');
// Delete existing files
fs.rmSync(`${dest}`, { recursive: true, force: true });

console.log('Copying files...');
// Copy root level src files
['index.html' , '404.html' , 'js/main.js'].forEach((file) => {
  console.log('Copy: ', file);
  fs.cp(`${src}/${file}`, `${dest}/${file}`, (err) => err && console.error(err));
});

console.log('\nCreating images dest folder...\n');
// Create img folder in docs
fs.mkdirSync(`${dest}/img`, { recursive: true });
fs.mkdirSync(`${dest}/brand`, { recursive: true });

console.log('Processing and optimizing images...\n');
// Resize, process and optimize images
sharp(`${src}/public/favicon.png`)
  .png({ quality: 80 })
  .toFile(`${dest}/brand/favicon.png`, (err) => err && console.error(err));

sharp(`${imgSrc}/logo.png`)
  .resize(271).webp({ quality: 50, lossless: true })
  .toFile(`${imgDest}/logo.webp`, (err) => err && console.error(err));
sharp(`${imgSrc}/logotype.png`)
  .resize(340).webp({ quality: 50, lossless: true })
  .toFile(`${imgDest}/logotype.webp`, (err) => err && console.error(err));

sharp(`${imgSrc}/placeholder-garden.jpg`).blur(3)
  .resize(1920, 1080, { position: 'top' }).avif({ quality: 50 })
  .toFile(`${imgDest}/placeholder-garden.avif`, (err) => err && console.error(err));
sharp(`${imgSrc}/lots-blueprint-color.jpg`)
  .resize(1650).avif({ quality: 50 })
  .toFile(`${imgDest}/lots-blueprint-color.avif`, (err) => err && console.error(err));
sharp(`${imgSrc}/splash-dark.jpg`)
  .resize(1920).avif({ quality: 80 })
  .toFile(`${imgDest}/splash-dark.avif`, (err) => err && console.error(err));

sharp(`${imgSrc}/render-home.jpg`)
  .resize(null, 700).avif({ quality: 50 })
  .toFile(`${imgDest}/render-home.avif`, (err) => err && console.error(err));
['green-areas', 'render-project-entrance'].forEach((file) => {
  sharp(`${imgSrc}/${file}.png`)
    .resize(null, 700).avif({ quality: 50 })
    .toFile(`${imgDest}/${file}.avif`, (err) => err && console.error(err));
});

['street', 'street-sign', 'transmission-tower', 'water-tap'].forEach((file) => {
  sharp(`${imgSrc}/${file}.png`)
    .webp({ quality: 50, lossless: true })
    .toFile(`${imgDest}/${file}.webp`, (err) => err && console.error(err));
});
  
console.log('Creating styles dest folder...');
// Create css folder in docs
fs.mkdir(cssDest, { recursive: true }, (err) => err && console.error(err));
