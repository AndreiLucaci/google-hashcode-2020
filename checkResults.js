const computeScore = require('./computeScore')

const inputFiles = [
  'a_example.txt',
  'b_read_on.txt',
  'c_incunabula.txt',
  'd_tough_choices.txt',
  'e_so_many_books.txt',
  'f_libraries_of_the_world.txt',
]

const checkResults = (files = inputFiles) => {
  const scores = files.map(x => computeScore(x))
  const total = scores.length ? scores.reduce((a, b) => a + b) : 0

  console.log(`Total score for this run: ${total}`)
  // computeScore(filename)
}

module.exports = checkResults
