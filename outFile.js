const fs = require('fs')
const os = require('os')
const path = require('path')

const toOut = (fileName, result) => {
  const name = path.basename(fileName, '.txt')
  const outFolder = 'output'

  const writer = fs.createWriteStream(`${outFolder}/${name}.out`, {
    flags: 'w+',
  })

  const writeLine = txt => {
    writer.write(txt.toString())
    writer.write(os.EOL)
  }

  writeLine(result.nrOfLibs)
  for (let library of result.libraries) {
    if (library.books.length) {
      writeLine(`${library.id} ${library.books.length}`)
      writeLine(library.books.join(' '))
    }
  }

  writer.end()
}

module.exports = toOut
