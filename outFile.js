const fs = require('fs')
const os = require('os')
const path = require('path')

const toOut = (fileName, result) => {
  const name = path.basename(fileName, '.txt')
  const outFolder = 'output'

  const filename = `${outFolder}/${name}.out`
  // const writer = fs.createWriteStream(filename, {
  //   flags: 'w+',
  // })

  // let str = ''

  const lines = []

  const writeLine = txt => {
    // str += txt.toString()
    // str += os.EOL
    // writer.write(txt.toString())
    // writer.write(os.EOL)
    lines.push(txt.toString())
  }

  writeLine(result.libraries.length)
  for (let library of result.libraries) {
    writeLine(`${library.id} ${library.books.length}`)
    writeLine(library.books.join(' '))
  }

  fs.writeFileSync(filename, lines.join(os.EOL))

  // writer.end()
}

module.exports = toOut
