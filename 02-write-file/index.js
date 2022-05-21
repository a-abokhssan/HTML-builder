const fs = require('fs')
const path = require('path')
const readline = require('readline')

process.on('SIGINT', () => {
  process.stdout.write('Bye-bye')
  process.exit(0)
})

const rl = readline.createInterface(process.stdin)
const ws = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {
  flags: 'a',
})

ws.on('open', () => {
  console.log('Text message:')
})

rl.on('line', (line) => {
  line === 'exit' ? process.emit('SIGINT') : ws.write(line + '\n')
})
