'use strict'
require('dotenv').config()
const conn = require('./lib/connectMongo')
const Ad = require('./models/Ad')
const User = require('./models/User')



conn.once('open', async () => {
  try {
    await createAds()
    await createUser()
    conn.close()
  } catch (err) {
    console.log('Hubo un error:', err)
    process.exit(1)
  }
})

async function createAds () {
  console.log('Delete Ads ...')
  await Ad.deleteMany()
  console.log('Create Ads ...')
  await Ad.insertMany([
    { name: 'Bicicleta', state: 'sell', price: 230.15, img: './images/bicicleta-de-montana-29-xr-trail-900-27b-1.jpg', tags: ['lifestyle'] },
    { name: 'Iphone5', state: 'buy', price: 63.85, img: './images/iphone5.jpg', tags: ['lifestyle', 'mobile'] },
    { name: 'BMW x5', state: 'sell', price: 12000.00, img: './images/bmw.jpeg', tags: ['motor'] },
    { name: 'MSI Creator 17m', state: 'sell', price: 850.00, img: './images/kv-nb.webp', tags: ['lifestyle'] },
  ])
}


async function createUser () {
  console.log('Delete User ...')
  await User.deleteMany()
  console.log('Create User ...')
  await User.insertMany(
    [{ email: 'user@example.com', passwd: await User.hashPasswd('1234')}]
  )
}
