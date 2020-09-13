'use strict'

const conn = require('./lib/connectMongo')
const Ad = require('./models/Ad')

conn.once('open', async () => {
  try {
    await createAds()
    conn.close()
  } catch (err) {
    console.log('Hubo un error:', err)
    process.exit(1)
  }
})

async function createAds () {
  console.log('Delete documents ...')
  await Ad.deleteMany()
  console.log('Create Ads ...')
  await Ad.insertMany([
    { name: 'Bicicleta', state: 'sell', price: 230.15, img: 'bici.jpg', tags: ['lifestyle', 'motor'] },
    { name: 'Iphone5', state: 'buy', price: 125.85, img: 'bici.jpg', tags: ['lifestyle', 'mobile'] },
    { name: 'Arquitrctura limpìa', state: 'sell', price: 12.00, img: 'bici.jpg', tags: ['lifestyle'] }
  ])
}
