'use strict';

const net = require('net');
const Stick = require('../index').stick;
const stick = new Stick(1024);
stick.setMaxBodyLen(4);

// server端
const server = net.createServer(socket => {
    socket.on('data', data => stick.putData(data));
    stick.onBody(body => console.log('body:', body.toString()));
    server.close();
});
server.listen(8080);

// client 端
const client = net.createConnection({ port: 8080, host: 'localhost' }, () => {
    const data = stick.makeData(JSON.stringify({ userName: 'liuwei' }));
    client.write(data);
    client.destroy();
});