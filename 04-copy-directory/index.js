const fs = require('fs')
const path = require('path')

const dirName = path.resolve(__dirname, 'files')
const copyDirName = path.join(__dirname, 'files-copy')

fs.rm(copyDirName, { recursive: true, force: true }, () => {
  fs.mkdir(copyDirName, { recursive: true }, (err) => {
    if (err) console.log(err)
  })
  copyFromDirToDir(dirName, copyDirName)
})

function copyFromDirToDir(fromDir, toDir) {
  fs.readdir(fromDir, { withFileTypes: true }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      data.forEach((element) => {
        if (element.isDirectory()) {
          fs.mkdir(
            path.resolve(toDir, element.name),
            { recursive: true },
            (err) => {
              if (err) console.log(err)
            }
          )
          copyFromDirToDir(
            path.resolve(fromDir, element.name),
            path.resolve(toDir, element.name)
          )
        } else {
          fs.createReadStream(
            path.resolve(fromDir, element.name),
            'utf-8'
          ).pipe(fs.createWriteStream(path.resolve(toDir, element.name)))
        }
      })
    }
  })
}
