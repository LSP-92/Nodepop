var express = require('express')
const path = require('path')
var router = express.Router()
const Ad = require('../models/Ad')

router.get('/', async function (req, res, next) {
  try {
    const sort = req.query.sort
    const limit = parseInt(req.query.limit || 10)
    const skip = parseInt(req.query.skip)
    const name = req.query.name
    const price = parseFloat(req.query.price)
    const tags = req.query.tags
    const state = req.query.state
    const mnPrice = parseFloat(req.query.mnPrice || 0)
    const mxPrice = parseFloat(req.query.mxPrice || 9999999.999)

    const filters = {}
    if (name) { filters.name = new RegExp('^' + req.query.name) }
    if (price) { filters.price = price }
    if (tags) { filters.tags = tags }
    if (state) { filters.state = state }

    const valueRes = await Ad.filters(filters, limit, sort, skip, mnPrice, mxPrice)
    if (valueRes.length === 0) { return next('No data') }

    res.render('index', { title: 'NodePOP', value: valueRes })
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.get('/img/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const valueRes = await Ad.findOne({ img: id })
    if (valueRes) {
      res.sendFile(path.join('/home/luis/Nodepop/Nodepop/public/api/', valueRes.img))
      return
    } else { next(650) }
  } catch (err) {
    next(err)
  }
})

module.exports = router
