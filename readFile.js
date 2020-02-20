const fs = require('fs')
const lineReader = require('n-readlines')

const toLib = (N, T, M, bookIds, id) => ({
  N,
  T,
  M,
  bookIds,
  id,
})

const inputFolder = 'input'

const readFile = fileName => {
  const filename = `${inputFolder}/${fileName}`
  const reader = new lineReader(filename)
  const get = () => (reader.next() || '').toString()

  const libraries = []
  const [B, L, D] = get()
    .split(' ')
    .map(x => Number(x))
  const bookScores = get()
    .split(' ')
    .map(x => Number(x))

  let i = 0
  while ((line = get())) {
    const [N, T, M] = line.split(' ').map(x => Number(x))
    const bookIds = get()
      .split(' ')
      .map(x => Number(x))

    libraries.push(toLib(N, T, M, bookIds, i++))
  }

  return {
    B,
    L,
    D,
    bookScores,
    libraries,
  }
}

module.exports = readFile
