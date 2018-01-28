'use strict'

const net = require('net')
const stick = require('../../index')
const msgCenter = new stick.msgCenter()

const client = net.createConnection({ port: 8080, host: '127.0.0.1' }, function () {
    const msgBuffer = msgCenter.publish('username=123&password=1234567,qwe')

    client.write(msgBuffer)
})

client.on('data', function (data) {
    console.log(data.toString())
})
client.on('end', function () {
    console.log('disconnect from server')
})