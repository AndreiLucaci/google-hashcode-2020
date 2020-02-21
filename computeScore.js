const readFile = require('./readFile')
const lineReader = require('n-readlines')
const path = require('path')

const outputFolder = 'output'
const termination = '.out'

const computeScore = filename => {
  const input = readFile(filename)
  const fileName = path.basename(filename, '.txt')
  const outFile = `${fileName}${termination}`

  const reader = new lineReader(path.join(outputFolder, outFile))
  let lineNr = 0
  const get = () => {
    const nxt = reader.next()

    if (nxt) {
      lineNr++
      return nxt.toString()
    } else {
      return ''
    }
  }

  let maxTime = input.D
  const libraries = input.libraries

  const alreadyScoredBooks = {}
  const alreadyScoredLibs = {}

  let score = 0

  const sections = Number(get().trim())
  let nrOfSections = sections
  while (maxTime > 0 && nrOfSections--) {
    // console.log(
    // `Processing section ${sections - nrOfSections}. maxTime: ${maxTime}`
    // )
    let line = get()
    let libId, nrOfBooks
    if (line) {
      ;[libId, nrOfBooks] = line
        .trim()
        .split(' ')
        .map(x => Number(x))

      if (alreadyScoredLibs.hasOwnProperty(libId)) {
        throw `[${fileName}]: Duplicate library on line ${lineNr}. Library with id ${libId} already processed`
      } else {
        alreadyScoredLibs[libId] = true
      }
    }

    line = get()
    if (!line) continue
    const bookIds = line
      .trim()
      .split(' ')
      .map(x => Number(x))
    if (nrOfBooks == 0 || bookIds.length != nrOfBooks) {
      throw `[${fileName}]: Number of books not correct on line ${lineNr}. Number of books: ${nrOfBooks}. Book array length: ${bookIds.length}`
    }

    maxTime -= libraries[libId].T
    for (let k = 0; k < maxTime; k++) {
      for (let l = 0; l < libraries[libId].M; l++) {
        const bkId = bookIds.shift()
        if (bkId === undefined) break

        if (!alreadyScoredBooks.hasOwnProperty(bkId)) {
          alreadyScoredBooks[bkId] = true
          score += input.bookScoresObj[bkId].val
        }
      }
    }
  }

  console.log(`Score for ${fileName}: ${score}`)

  return score
}

module.exports = computeScore
