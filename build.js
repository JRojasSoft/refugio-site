// cp ./src/public/* ./dist
// cp ./src/main.js ./dist
// cp ./src/index.html ./dist

const fs = require('fs');

// copy directory
fs.cp('./src/public', './dist', { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

fs.cp('./src/main.js', './dist/main.js', (err) => {
  if (err) {
    console.error(err);
  }
});
fs.cp('./src/index.html', './dist/index.html', (err) => {
  if (err) {
    console.error(err);
  }
});