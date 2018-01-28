'use strict'

const net = require('net')

const client = net.createConnection({ port: 8080, host: '127.0.0.1' }, function () {
    const body = Buffer.from('username=123&password=1234567,qwe')

    // 写入包头
    const headBuf = new Buffer(4)
    headBuf.writeUInt32BE(body.byteLength, 0)
    console.log('data length: ' + headBuf.readInt32BE())

    // 发送包头
    client.write(headBuf)
    // 发送包内容
    client.write(body)

    console.log('data body: ' + body.toString())

})

client.on('data', function (data) {
    console.log(data.toString())
})
client.on('end', function () {
    console.log('disconnect from server')
})