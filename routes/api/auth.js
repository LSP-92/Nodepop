'use strict'

const User = require('../../models/User')
const jwt = require('jsonwebtoken')

// Auth Controller

class AuthController {

  async post (req, res, next) {
        
    try  {
      const params = req.body
      if(!params.user || !params.passwd) {
        const error = new Error('Insert Email and Password')
        error.status = 401
        next(error)
      }

      const user = {
        email: params.user,
        passwd: params.passwd
      }

      const userDb = await User.findOne({ email: user.email })

      if (!await userDb.checkPasswd(user)){
        const error = new Error('Invalid Credentials')
        error.status = 401
        next(error)
      }

      jwt.sign({ userApi: user.email }, process.env.SECRETJWT, { expiresIn: '3d' }, (err, tokenJwt) => {
        if(err) {
          next(err)
        }
        res.status(200).json({ message: 'login completed',
          status: 200,
          tokenApi: tokenJwt 
        })
      })
      
    } catch{
      const error = new Error('Server ERROR')
      error.status = 500
      next(error)
    }

  }

}

module.exports = new AuthController()