'use strict'

const net = require('net')
const stick_package = require('../../index').stick

const tcp_server = net.createServer(function (socket) {
    socket.stick = new stick_package(1024).setReadIntBE('32')
    socket.on('data', function (data) {
        socket.stick.putData(data)
    })

    socket.stick.onData(function (data) {
        // 解析包头长度
        const head = new Buffer(4)
        data.copy(head, 0, 0, 4)

        // 解析数据包内容
        const body = new Buffer(head.readInt32BE())
        data.copy(body, 0, 4, head.readInt32BE())

        console.log('data length: ' + head.readInt32BE())
        console.log('body content: ' + body.toString())
    })

    socket.on('close', function (error) {
        console.log('client disconnected')
    })

    socket.on('error', function (error) {
        console.log(`error:客户端异常断开: ${error}`)
    })
})

tcp_server.on('error', function (err) {
    throw err
})
tcp_server.listen(8080, function () {
    console.log('tcp_server listening on 8080')
})