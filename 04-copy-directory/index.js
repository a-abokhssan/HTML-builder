const fs = require('fs')
const path = require('path')

const dirName = path.resolve(__dirname, 'files')
const copyDirName = path.join(__dirname, 'files-copy')

async function copyFromDirToDir(fromDir, toDir) {
  await fs.promises.rm(toDir, { recursive: true, force: true })
  await fs.promises.mkdir(toDir, { recursive: true })
  try {
    const dataList = await fs.promises.readdir(fromDir, { withFileTypes: true })

    dataList.forEach(async (element) => {
      if (element.isDirectory()) {
        copyFromDirToDir(
          path.resolve(fromDir, element.name),
          path.resolve(toDir, element.name)
        )
      } else {
        fs.createReadStream(path.resolve(fromDir, element.name), 'utf-8').pipe(
          fs.createWriteStream(path.resolve(toDir, element.name))
        )
      }
    })
  } catch (err) {
    console.log(err)
  }
}

copyFromDirToDir(dirName, copyDirName)
