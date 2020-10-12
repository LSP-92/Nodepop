var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
const api = require('./routes/api/ads')

var app = express()
require('./lib/connectMongo')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  if (req.originalUrl.startsWith('/api')) {
    res.json({ error: err })
    return
  }

  if (err === 650) {
    res.render('error-img', { message: 'Imagen no valida' })
    return
  }

  res.status(err.status || 500)
  res.render('error')
  console.log(err)
})

module.exports = app
