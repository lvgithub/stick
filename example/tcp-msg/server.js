'use strict'

const net = require('net');
const stick = require('../../index');

const tcp_server = net.createServer(function (socket) {
    const msgCenter = new stick.msgCenter();

    socket.on('data', data => msgCenter.putData(data));
    socket.on('close', () => console.log('client disconnected'));
    socket.on('error', error => console.log(`error:客户端异常断开: ${error}`));

    msgCenter.onMsgRecv(data => console.log('recv data: ' + data.toString()));
})


tcp_server.on('error', err => console.log(err));
tcp_server.listen(8080, () => console.log('tcp_server listening on 8080'));


