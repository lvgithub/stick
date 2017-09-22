const net = require('net')
const stick_package = require('../index')

let tcp_server = net.createServer(function (socket) {
    socket.stick = new stick_package(1024).setReadIntBE('32')
    socket.on('data', function (data) {
        socket.stick.putData(data)
    })

    socket.stick.onData(function (data) {
        // 解析包头长度
        let head = new Buffer(4)
        data.copy(head, 0, 0, 4)

        // 解析数据包内容
        let body = new Buffer(head.readInt32BE())
        data.copy(body, 0, 4, head.readInt32BE())

        console.log('data length: ' + head.readInt32BE())
        console.log('body content: ' + body.toString())
    })

    socket.stick.onError(function (error) {
        console.log('stick data error:' + error)
    })

    socket.on('close', function (err) {
        console.log('client disconnected')
    })
})

tcp_server.on('error', function (err) {
    throw err
})
tcp_server.listen(8080, function () {
    console.log('tcp_server listening on 8080')
})