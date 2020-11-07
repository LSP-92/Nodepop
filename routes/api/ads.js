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
    
    if (!name) {
      const error = new Error('No name found')
      error.status =404
      return next(error) 
    } 

    if (!price) {
      const error = new Error('No price found')
      error.status =404
      return next(error) 
    } 

    if (!tags) {
      const error = new Error('No tags found')
      error.status =404
      return next(error) 
    }

    if (!state) {
      const error = new Error('No state found')
      error.status =404
      return next(error) 
    }

    if (!img) {
      const error = new Error('No img found')
      error.status =404
      return next(error) 
    } 
              
    filters.state = state
    filters.img = img 
    filters.name = new RegExp('^' + req.query.name)
    filters.price = price 
    filters.tags = tags
    
    const valueRes = await Ad.filters(filters, limit, sort, skip, mnPrice, mxPrice)

    if (valueRes.length === 0) { 
      const error = new Error('No data found')
      error.status =404
      return next(error) 
    }

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

    if (!bodyReq.name && bodyReq.name === '') {
      const error = new Error('Need name to create ad')
      error.status = 404
      next(error)
    }

    if (!bodyReq.price) {
      const error = new Error('Need price to create ad')
      error.status = 404
      next(error)
    } 

    if (!bodyReq.state && (bodyReq.state !== 'buy' || bodyReq.state !== 'sell')) {      
      const error = new Error('Need state to create ad')
      error.status = 404
      next(error)
    } 

    if (!req.file) { 
      const error = new Error('Need image to create ad')
      error.status = 404
      next(error)
    }
    
    const ad = new Ad(bodyReq)
    ad.img = `/api/${req.file.filename}`

    const valueRes = await ad.save(ad)

    await ad.sendQueue()

    res.json(['Ad create', valueRes])

  } catch (err) {

    const error = new Error(err)
    error.status = 500
    next(error)
  }
})

// Delete Ads
router.delete('/del', async function (req, res, next) {
  try {

    const _id = req.query._id
    const valueRes = await Ad.deleteOne({ _id: _id })
    res.json({ deleteAds: valueRes.n })

  } catch (err) {

    const error = new Error(err)
    error.status = 500

    next(error)
  }
})

module.exports = router
