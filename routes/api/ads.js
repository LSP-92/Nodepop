'use strict'

var express = require('express')
const multer = require('multer')
var router = express.Router()
const Ad = require('../../models/Ad')

/* GET all BBDD Ads with or without filters */
router.get('/', async function (req, res, next) {
  try {
    const sort = req.query.sort
    const limit = parseInt(req.query.limit || 10)
    const skip = parseInt(req.query.skip)
    const name = req.query.name
    const price = parseFloat(req.query.price)
    const tags = req.query.tags
    const img = req.query.img
    const state = req.query.state
    const mnPrice = parseFloat(req.query.mnPrice || 0)
    const mxPrice = parseFloat(req.query.mxPrice || 9999999.999)

    const filters = {}
    if (name) { filters.name = new RegExp('^' + req.query.name) }
    if (price) { filters.price = price }
    if (tags) { filters.tags = tags }
    console.log(filters.tags)
    if (state) { filters.state = state }
    if (img) { filters.img = img }

    const valueRes = await Ad.filters(filters, limit, sort, skip, mnPrice, mxPrice)
    if (valueRes.length === 0) { return next(600) } // No data en consulta

    res.json(valueRes)
  } catch (err) {
    next(err)
  }
})

// Create Ads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/api')
  },
  filename: function (req, file, cb) {
    const myFilename = `ad-${file.fieldname}-${Date.now()}-${file.originalname}`
    cb(null, myFilename)
  }
})
const uploadImg = multer({ storage: storage })

router.post('/new', uploadImg.single('img'), async function (req, res, next) {
  try {
    const bodyReq = req.body
    const imgFile = {}

    if (bodyReq.name && bodyReq.name !== '') {} else {
      return next(555) /*  error 555 fallo al crear ad falta nombre */
    }

    if (bodyReq.price) {} else {
      return next(554)/*  error 554 fallo al crear ad falta precio */
    }

    if (bodyReq.state && (bodyReq.state === 'buy' || bodyReq.state === 'sell')) {} else {
      return next(553)/*  error 553 fallo al crear ad falta state */
    }

    if (req.file) { imgFile.name = req.file.filename } else { imgFile.name = 'none' }

    const ad = new Ad(bodyReq)
    ad.img = imgFile.name // Si no hay imagen guarda none por defecto
    const valueRes = await ad.save(ad)
    res.json(['ok', valueRes])
  } catch (err) {
    console.log(err)
    next(err)
  }
})

// Delete Ads
router.delete('/del', async function (req, res, next) {
  try {
    const _id = req.query._id

    const valueRes = await Ad.deleteOne({ _id: _id })

    res.json({ deleteAds: valueRes.n })
  } catch (err) {
    next(err)
  }
})

module.exports = router
