const jwt = require('jsonwebtoken')

module.exports = function () {
  return function (req, res, next) {
    const tokenJwt = req.headers.apitoken || req.query.token
    if (!tokenJwt) {
      const error = new Error('No Token in request header')
      error.status = 401
      next(error)
      return
    }

    jwt.verify(tokenJwt, process.env.SECRETJWT, function(error, payload) {
      if (error) {
        const error = new Error('No valid Token')
        error.status = 401
        next(error)
        return
      }
      next()
    })
  }

}