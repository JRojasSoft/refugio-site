// cp ./src/public/* ./docs
// cp ./src/main.js ./docs
// cp ./src/index.html ./docs

const fs = require('fs');

// copy directory
fs.cp('./src/public', './docs', { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

fs.cp('./src/main.js', './docs/main.js', (err) => {
  if (err) {
    console.error(err);
  }
});
fs.cp('./src/index.html', './docs/index.html', (err) => {
  if (err) {
    console.error(err);
  }
});