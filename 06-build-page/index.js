const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectDist = path.resolve(__dirname, 'project-dist');

const htmlDirName = path.resolve(__dirname, 'template.html');
const templatesDirName = path.resolve(__dirname, 'components');
const pathForHtmlBundle = path.resolve(__dirname, 'project-dist', 'index.html');

const stylesDirName = path.resolve(__dirname, 'styles');
const pathForBundleStyles = path.resolve(__dirname, 'project-dist', 'style.css');

const assetsDirName = path.resolve(__dirname, 'assets');
const pathForAssets = path.resolve(__dirname, 'project-dist', 'assets');

fs.rm(projectDist, { recursive: true, force: true }, () => {
  fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) console.log(err.message);
  });
  bundleHtml(htmlDirName, pathForHtmlBundle, templatesDirName);
  copyFromDirToDir(assetsDirName, pathForAssets);
  bundleStyles(stylesDirName, pathForBundleStyles);
});

async function bundleHtml(from, to, templates) {
  const ws = fs.createWriteStream(to);
  const rs = fs.createReadStream(from);
  const rl = readline.createInterface(rs);

  for await (const line of rl) {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('{{') && cleanLine.endsWith('}}')) {
      const fileName = `${cleanLine.slice(2, -2)}.html`;
      try {
        await fs.promises.access(
          path.resolve(templates, fileName),
          fs.constants.R_OK
        );
        const rsFile = fs.createReadStream(path.resolve(templates, fileName));
        rsFile.pipe(ws, { end: false });
        await new Promise((resolve) => rsFile.on('end', resolve));
      } catch (err) {
        console.log(err);
      }
    } else {
      ws.write(line + '\n');
    }
  }
}

async function copyFromDirToDir(fromDir, toDir) {
  await fs.promises.rm(toDir, { recursive: true, force: true });
  await fs.promises.mkdir(toDir, { recursive: true });
  try {
    const dataList = await fs.promises.readdir(fromDir, { withFileTypes: true });

    dataList.forEach(async (element) => {
      if (element.isDirectory()) {
        copyFromDirToDir(
          path.resolve(fromDir, element.name),
          path.resolve(toDir, element.name)
        );
      } else {
        fs.createReadStream(path.resolve(fromDir, element.name)).pipe(
          fs.createWriteStream(path.resolve(toDir, element.name))
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function bundleStyles(from, to) {
  const ws = fs.createWriteStream(to);

  fs.readdir(from, { withFileTypes: true }, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      data.forEach((elem) => {
        const ext = path.extname(elem.name);
        if (elem.isFile() && ext === '.css') {
          fs.createReadStream(path.resolve(from, elem.name)).pipe(ws);
        }
      });
    }
  });
}
