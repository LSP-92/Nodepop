'use strict'

const mongoose = require('mongoose')
const amqpConnectPromise = require('../lib/amqpSender')
const queueName = 'imagesProcess'


// Definimos el esquema
const adSchema = mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  tags: [String]

})

// Definimos metodos estaticos

// Metodos para filtrar por opcion filTags:: Array de etiquetas, adState (venta o compra), mxPrice precio maximo mnPrice price minimo
adSchema.statics.filters = function (filters, limit, sort, skip, mnPrice, mxPrice) {
  const query = Ad.find(filters)
  query.limit(limit)
  query.sort(sort)
  query.skip(skip)
  query.find({ price: { $gte: mnPrice } })
  query.find({ price: { $lt: mxPrice } })

  return query.exec()
}

adSchema.methods.sendQueue = async function () {
  
  const conn = await amqpConnectPromise
  const channel = await conn.createChannel()

  const awai = await channel.assertQueue(queueName, {
    durable: true
  })

  channel.sendToQueue(queueName, Buffer.from(this.img), {
    persistent: true
  } )

  console.log('message publish')
  console.log(awai)
}

const Ad = mongoose.model('Ad', adSchema) // Creamos el modelo ads con el esquema adSchema

module.exports = Ad
