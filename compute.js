const readFile = require('./readFile')
const outFile = require('./outFile')

const generateResult = () => ({
  nrOfLibs: 2,
  libraries: [
    {
      id: 1,
      nrOfBooks: 5,
      books: [1, 2, 3, 4, 5],
    },
    {
      id: 2,
      nrOfBooks: 5,
      books: [1, 2, 3, 4, 5],
    },
  ],
})

const compute = fileName => {
  const input = readFile(fileName)
  const { libraries } = input

  const orderedLibraries = [...libraries].sort((a, b) => {
    // const firstSortCriteria = a.T - b.T
    // if (!firstSortCriteria) {
    const bSum = b.bookIds.map(x => input.bookScores[x]).reduce((c, d) => c + d)
    const aSum = a.bookIds.map(x => input.bookScores[x]).reduce((c, d) => c + d)
    return bSum - aSum
    // } else {
    // return firstSortCriteria
    // }
  })

  const createOrderedbookDic = arr => {
    const dic = {}

    for (let i = 0; i < arr.length; i++) {
      dic[i] = {
        val: arr[i],
        i,
      }
    }

    // const dic = arr.reduce(
    //   (acc, val, i) => ({
    //     ...acc,
    //     ...{
    //       [i]: { val, i },
    //     },
    //   }),
    //   {}
    // )

    return dic
  }

  const result = {
    nrOfLibs: 0,
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

  // const processedBooks = []

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
          // .filter(x => !processedBooks[x.i])
          .sort((a, b) => b.val - a.val)

        for (let j = 0; j < sLib.M && unprocessedBooks.length; ) {
          const ub = unprocessedBooks.shift()
          const bkId = ub.i

          // if (!processedBooks[bkId]) {
          // processedBooks[bkId] = true
          const index = sLib.bookIds.indexOf(bkId)
          if (index > -1) {
            sLib.bookIds.splice(index, 1)
          }
          rLib.books.push(bkId)
          j++
          continue
          // }
        }
      }
    }

    if (sigLib) {
      sigLib.T--
      if (!sigLib.T) {
        signedUpLibs.push(sigLib)
        sigLib = orderedLibraries.shift()
        result.nrOfLibs++
      }
    }
  }

  result.libraries = Object.values(result.libraries).filter(x => x.books.length)
  outFile(fileName, result)
}

module.exports = compute
