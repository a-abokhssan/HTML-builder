const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, 'text.txt')

const rs = fs.createReadStream(filePath)

rs.on('error', (error) => {
  console.log(error.message)
})

rs.on('open', () => {
  rs.pipe(process.stdout)
})
