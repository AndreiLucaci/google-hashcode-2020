const readFile = require('./readFile')
const outFile = require('./outFile')

const compute = fileName => {
  const input = readFile(fileName)
  const { libraries } = input

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
  const books = createOrderedbookDic(input.bookScores)

  let orderedLibraries = []
  const computeOrderedLibraries = () => {
    orderedLibraries = [...libraries].sort((a, b) => {
      const firstSortCriteria = a.T - b.T
      const secondSortCriteria = b.M - a.M

      return firstSortCriteria || secondSortCriteria
    })
  }

  computeOrderedLibraries()

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

  let signedUpLibs = []
  let sigLib = orderedLibraries.shift()

  const processedBooks = {}

  const recomputeOrderedLibraries = tMax => {
    if (orderedLibraries.length) {
      orderedLibraries = [
        ...(orderedLibraries.length ? orderedLibraries : libraries),
      ]
        .filter(x => x.bookIds.length && tMax > x.T)
        .sort((a, b) => {
          // const firstSortCriteria = a.T - b.T
          // const secondSortCriteria = b.M - a.M

          const bookScores = x => {
            const vb = x.bookIds
              .filter(y => !processedBooks.hasOwnProperty(y))
              .map(y => books[y])
              .sort((c, d) => d.val - c.val)
              .slice(0, (tMax - x.T) * x.M)

            const score = vb.length
              ? vb.reduce((acc, vl) => acc + Number(vl.val), 0)
              : 100

            return score
          }

          const bScore = bookScores(b)
          const aScore = bookScores(a)
          b.bookScore = bScore
          a.bookScore = aScore

          return bScore - aScore

          // return firstSortCriteria || secondSortCriteria

          // const cs = x => (tMax - x.T) * x.M
          // const css = (x, csx) => {
          //   const itms = x.bookIds.slice(0, csx).filter(y => y)
          //   if (itms.length) {
          //     itms.reduce((c, d) => {
          //       const res = c + books[d].val
          //       return res
          //     })
          //   }
          // }
          // const [csb, csa] = [cs(b), cs(a)]
          // if (csb > 0 && csa > 0) {
          //   const [cssb, cssa] = [css(b, csb), css(a, csa)]
          //   return cssb - cssa
          // }
        })
    }
  }

  for (let i = 0; i < input.D; i++) {
    if (!(i % 1000)) {
      console.log(i)
    }

    if (signedUpLibs.length) {
      signedUpLibs = signedUpLibs.filter(x => x.bookIds.length)

      for (let j = 0; j < signedUpLibs.length; j++) {
        const sLib = signedUpLibs[j]
        let rLib = result.libraries[sLib.id]
        if (!rLib) {
          rLib = createLib(sLib)
        }

        const unprocessedBooks = sLib.bookIds
          .map(x => books[x])
          .sort((a, b) => b.val - a.val)

        let k = 0
        while (k < sLib.M && unprocessedBooks.length) {
          const ub = unprocessedBooks.shift()
          const bkId = ub.i

          for (let l = j; l < signedUpLibs.length; l++) {
            const lLib = signedUpLibs[l]
            const index = lLib.bookIds.indexOf(bkId)
            if (index > -1) {
              lLib.bookIds.splice(index, 1)
            }
          }

          if (processedBooks[bkId]) continue

          orderedLibraries.forEach(x => {
            const index = x.bookIds.indexOf(bkId)
            if (index > -1) {
              x.bookIds.splice(index, 1)
            }
          })

          processedBooks[bkId] = true
          rLib.books.push(bkId)
          k++
        }
      }
    }

    if (sigLib) {
      sigLib.T--
      if (!sigLib.T) {
        signedUpLibs.push(sigLib)
        recomputeOrderedLibraries(input.D - i)

        sigLib = orderedLibraries.shift()
        if (sigLib) {
          console.log(
            `Now processing lib[${sigLib.id}] with a score of: ${sigLib.bookScore}`
          )
        }
      }
    }
  }

  result.libraries = Object.values(result.libraries).filter(x => x.books.length)
  outFile(fileName, result)
}

module.exports = compute
