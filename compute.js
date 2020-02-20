const readFile = require('./readFile')
const outFile = require('./outFile')

const compute = fileName => {
  const input = readFile(fileName)
  const { libraries } = input

  const orderedLibraries = [...libraries]
    .map(x => {
      x.potentialScore = x.bookIds
        .map(x => input.bookScores[x])
        .reduce((c, d) => c + d)
      return x
    })
    .sort((a, b) => {
      const firstSortCriteria = a.T - b.T
      const secondSortCriteria = b.M - a.M
      const thirdSortCriteria = b.potentialScore - a.potentialScore

      return firstSortCriteria || secondSortCriteria || thirdSortCriteria
    })

  const createOrderedbookDic = arr => {
    const dic = {}

    for (let i = 0; i < arr.length; i++) {
      dic[i] = {
        val: arr[i],
        i,
      }
    }

    return dic
  }

  const result = {
    libraries: {},
  }

  const createLib = lib => {
    const rLib = {
      id: lib.id,
      books: [],
    }
    result.libraries[lib.id] = rLib
    return rLib
  }

  const books = createOrderedbookDic(input.bookScores)
  const signedUpLibs = []
  let sigLib = orderedLibraries.shift()

  const processedBooks = {}

  for (let i = 0; i < input.D; i++) {
    if (!(i % 1000)) {
      console.log(i)
    }

    if (signedUpLibs.length) {
      for (let sLib of signedUpLibs) {
        let rLib = result.libraries[sLib.id]
        if (!rLib) {
          rLib = createLib(sLib)
        }

        const unprocessedBooks = sLib.bookIds
          .map(x => books[x])
          .sort((a, b) => b.val - a.val)

        let j = 0
        while (j < sLib.M && unprocessedBooks.length) {
          const ub = unprocessedBooks.shift()
          const bkId = ub.i

          const index = sLib.bookIds.indexOf(bkId)
          if (index > -1) {
            sLib.bookIds.splice(index, 1)
          }

          if (processedBooks[bkId]) continue

          processedBooks[bkId] = true
          rLib.books.push(bkId)
          j++
        }
      }
    }

    if (sigLib) {
      sigLib.T--
      if (!sigLib.T) {
        signedUpLibs.push(sigLib)
        sigLib = orderedLibraries.shift()
      }
    }
  }

  result.libraries = Object.values(result.libraries).filter(x => x.books.length)
  outFile(fileName, result)
}

module.exports = compute
