var express = require('express')
const path = require('path')
var router = express.Router()


router.get('/:value',  function (req, res, next) {
  const value = req.params.value
  const path = req.get('referer')
  console.log(path)
  console.log(value)
  res.cookie('language-locale', value, { maxAge: 1000*60*60*24, httpOnly: true })
  res.redirect(path)
  })

  module.exports = router