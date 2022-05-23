const { readdir, stat } = require('fs');
const path = require('path');

const dirPath = path.resolve(__dirname, 'secret-folder');

readdir(dirPath, { withFileTypes: true }, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    data.forEach((element) => {
      if (element.isFile()) {
        const name = path.parse(element.name).name;
        const ext = path.parse(element.name).ext;

        stat(path.join(dirPath, element.name), (err, stats) => {
          if (err) return console.log(err.message);
          const size = stats.size;
          console.log(
            `${name} - ${ext.slice(1)} - ${(size / 1024).toFixed(1)}kb`
          );
        });
      }
    });
  }
});
