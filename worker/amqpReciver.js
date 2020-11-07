'use strict'

require('dotenv').config()
const path = require('path')
const Jimp = require('jimp')
const amqpConnectPromise = require('../lib/amqpSender')  
const queueName = 'imagesProcess'




async function main() {
  try {

    const conn = await amqpConnectPromise
    const channel = await conn.createChannel()  

    await channel.assertQueue(queueName, {
      durable: true
    })
  
    channel.prefetch(1);
  
    channel.consume(queueName, msg => {
      ImgResize(msg.content.toString())
      channel.ack(msg)
    })
    
  } catch (err) {

    const error = new Error('Error queue, server no response')
    error.status = 500
    console.log(error)
  }


}

main()


async function ImgResize(dir) {
  try{

    const image = await Jimp.read(`/home/luis/Practica-Node-Avanzado/Nodepop/public/${dir}`)
    const destino = path.join(__dirname,`/img_converter/${Date.now()}.jpg`)
    image.resize(100, 100).write(destino)

    console.log('Imagen Procesada')

  }catch (err) {
    const error = new Error('fallo resize')
    console,log(error, err)
  }
} 
  
