# Stick

## The solution of sticky package problem of TCP for Node.Js !

[If you like, you can subscribe to start or watch](https://github.com/lvgithub/stick)

[中文文档](https://github.com/lvgithub/stick/blob/master/README.ZH.md)

---

## Table of Contents
* Install
* Characteristics
* Configure
* APIs
* Changelog
* Usage
* Examples

---

## Install
```
npm i stickpackage
```

---
## Trait
* low memory, using circular queue data structure, unpack, queue memory according to user packet size configuration。
* high concurrency, 1500 packets per second at present, 300 bytes per packet, less than 30M in memory, and less than 40% for single core CPU 

---

## Configuration

* [x] Provide solutions for TCP sticky processing
* [x] The default buffer is 512 bytes, and when the data is over 512 bytes, the buffer space is automatically expanded with a 512 multiple
* [x] By default, two bytes in Baotou are used to represent the packet length
* [x] The main connection mode to receive data by default
* [x] You can configure the big end of the small end of reading
* [x] You can configure custom Baotou length
* [x] Support automatic disassembly package

---

## API
* stick(bufferSize) => Processing bytes type packages
```
    bufferSize: Setting the size of the cache space
```
* stick.setReadIntBE(type) => In big endian mode is set to the maximum packet size on the basis of "choose the right type
```
    setReadIntBE(type)  type:16  short(len:2)
    setReadIntBE(type)  type:32  int(len:4)
```
* stick.setReadIntLE => In small endian mode is set to the maximum packet size on the basis of "choose the right type
```
    setReadIntLE(type)  type:16  short(len:2)
    setReadIntLE(type)  type:32  int(len:4)
```
* stick.putData(buffer) => Put data to stick
* stick.onData(buffer) => Get the all data
* msgCenter(options) => Processing string type packages
```
    options.bufferSize: Setting the size of the cache space
    options.type：Set header length (16|32)
    options.bigEndian: The default buffer is false
```
* msgCenter.putMsg(msg) => Put msg data to stick
* msgCenter.publish(msg) => Send a msg 
```
    msgCenter.publish('123') 
    => <Buffer 00 03 31 32 33> // 00 03 (data len)  31 32 33 (123)
```
* msgCenter.onMsgRecv(msgHandleFun) => Get all data
```
    msgHandleFun:
    msgCenter.onMsgRecv(msg => {
        console.log(`recv data: ` + msg.toString())
        ...do something
    })
```

---

## Updates:

* Add endian mode config,setReadIntBE,setReadIntLE
* Add send string msg

---

## Usage
*  stick data
```
    const MsgCenter = require('stickpackage').msgCenter
    const msgCenter = new MsgCenter()

    msgCenter.onMsgRecv(data => {
        console.log(`recv data: ` + data.toString())
    })

    msgCenter.putData(Buffer.from([0x00, 0x02, 0x31, 0x32, 0x00, 0x04, 0x31, 0x32, 0x33, 0x34]))
    //=> recv data: 12
    //=> recv data: 1234

```
---

* send buffer data
```
    const Stick = require('stickpackage').stick;
    const stick = new Stick(1024).setReadIntBE('16')

    /*
    *  data1:[0x00, 0x02, 0x66, 0x66]
    *  data2:[0x00, 0x04, 0x88, 0x02, 0x11, 0x11]
    */
    const data = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

    const data2_1 = Buffer.from([0x00, 0x00, 0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
    const data2_2 = Buffer.from([0x11]);

    stick.onData(function (data) {
        console.log('receive data,length:' + data.length);
        console.log(data)
    });

    stick.putData(data);        
    stick.putData(data2_1);
    stick.putData(data2_2);  

    //  result：   
    //  receive data,length:4 <Buffer 00 02 66 66>  
    //  receive data,length:6 <Buffer 00 04 88 02 11 11>
    //  receive data,length:2 <Buffer 00 00> receive data, length:4 < Buffer 00 02 66 66> receive data, length:6< Buffer 00 04 88 02 11 11>
```
---

## Demo（[See the example folder](https://github.com/lvgithub/stick/tree/master/example)）
* tcp-msg
```
    // Client.js
    const net = require('net')
    const stick = require('../../index')
    const msgCenter = new stick.msgCenter()

    const client = net.createConnection({
         port: 8080, 
         host: '127.0.0.1'
    }, function () {
        const msgBuffer = msgCenter.publish('username=123&password=1234567,qwe')
        client.write(msgBuffer)
    })

    client.on('data', function (data) {
        console.log(data.toString())
    })

    client.on('end', function () {
        console.log('disconnect from server')
    })
```
```
// Server.js
    const net = require('net')
    const stick = require('../../index')

    const tcp_server = net.createServer(function (socket) {
        const msgCenter = new stick.msgCenter()

        socket.on('data', function (data) {
            msgCenter.putData(data)
        })

        msgCenter.onMsgRecv(function (data) {
            console.log('recv data: ' + data.toString())
        })

        socket.on('close', function (error) {
            console.log('client disconnected')
        })

        socket.on('error', function (error) {
            console.log(`error: ${error}`)
        })
    })

    tcp_server.on('error', function (err) {
        throw err
    })

    tcp_server.listen(8080, function () {
        console.log('tcp_server listening on 8080')
    })
```
* tcp-buffer
```
// Clinet.js
    const net = require('net')

    const client = net.createConnection({ port: 8080, host: '127.0.0.1' }, function () {
        const body = Buffer.from('username=123&password=1234567,qwe')

        const headBuf = new Buffer(4)
        headBuf.writeUInt32BE(body.byteLength, 0)
        console.log('data length: ' + headBuf.readInt32BE())

        client.write(headBuf)
        client.write(body)

        console.log('data body: ' + body.toString())
    })

    client.on('data', function (data) {
        console.log(data.toString())
    })

    client.on('end', function () {
        console.log('disconnect from server')
    })
```
```
    // Server.js
    const net = require('net')
    const stick_package = require('../../index').stick

    const tcp_server = net.createServer(function (socket) {
        socket.stick = new stick_package(1024).setReadIntBE('32')
        socket.on('data', function (data) {
            socket.stick.putData(data)
        })

        socket.stick.onData(function (data) {

            const head = new Buffer(4)
            data.copy(head, 0, 0, 4)

            const body = new Buffer(head.readInt32BE())
            data.copy(body, 0, 4, head.readInt32BE())

            console.log('data length: ' + head.readInt32BE())
            console.log('body content: ' + body.toString())
        })

        socket.on('close', function (error) {
            console.log('client disconnected')
        })

        socket.on('error', function (error) {
            console.log(`error: ${error}`)
        })
    })

    tcp_server.on('error', function (err) {
        throw err
    })
    
    tcp_server.listen(8080, function () {
        console.log('tcp_server listening on 8080')
    })
```
---

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, ximen (G.doe) 
