'use strict'

const mongoose = require('mongoose')
const conex = mongoose.connection

conex.on('error', (err) => {
  console.log(`Connection error ${err}`)
  process.exit(1)
})
conex.on('open', () => console.log(`Connection ${conex.name}`))

mongoose.connect('mongodb://localhost/nodepop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = conex
