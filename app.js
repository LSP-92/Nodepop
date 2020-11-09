const createError =   require('http-errors')
const express =       require('express')
const path =          require('path')
const cookieParser =  require('cookie-parser')
const logger =        require('morgan')

const i18n =          require('./lib/i18nConfig')
const indexRouter =   require('./routes/index')
const api =           require('./routes/api/ads')
const authJwt =       require('./routes/api/authJwt')
const authControler = require('./routes/api/auth')
const changeLang    = require('./routes/changeLanguage')
                      require('./lib/connectMongo')

const app =           express()



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Middlewares

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(i18n.init)

//Routers

app.use('/select',         changeLang)
app.use('/',               indexRouter)
app.use('/api', authJwt(), api)

// Controllers

app.post('/auth',          authControler.post)



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

  if (req.originalUrl.startsWith('/auth')) {
    res.json({ error: err})
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
