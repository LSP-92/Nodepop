'use strict'


const amqplib = require('amqplib')

const amqpConnectPromise = amqplib.connect(process.env.AMQP_URL_STRING)


module.exports = amqpConnectPromise