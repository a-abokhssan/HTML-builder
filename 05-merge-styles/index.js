const fs = require('fs')
const path = require('path')

const dirName = path.resolve(__dirname, 'styles')
const dirForBundle = path.join(__dirname, 'project-dist', 'bundle.css')

function bundleFile(from, to) {
  const ws = fs.createWriteStream(to)

  fs.readdir(from, { withFileTypes: true }, (err, data) => {
    if (err) {
      console.log(err.message)
    } else {
      data.forEach((elem) => {
        const ext = path.extname(elem.name)
        if (elem.isFile() && ext === '.css') {
          fs.createReadStream(path.resolve(from, elem.name)).pipe(ws)
        }
      })
    }
  })
}

bundleFile(dirName, dirForBundle)
