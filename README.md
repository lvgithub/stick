## 背景

由于 TCP 协议是面向流的协议，我们使用 TCP 通信的时候，需要解析出我们的数据，就需要对流进行解析。也就是所谓的拆包，把流解析为一段段我们所需要的数据。本方案为 Node.Js 实现的一个粘包处理方案。[喜欢的话 star，想订阅点 watch~](https://github.com/lvgithub/stick)

## 原理

对要发送的数据进行协议编码，把一份数据`data`分为 `header` +`body`两个结构，header 默认固定长度（_2 byte_），`header`的内容描述的是 `body` 数据的长度。由于`header`定长，因此可以通过解析`header`，动态解析 `body` 的内容。

![image-20200704170816148](assets/README/image-20200704170816148.png)

如上图，我们看先取出数据流的前两位，读取到内容 `0x00, 0x02`转化为整数的长度是 2，再读取出`body`第3、4位 `0x61, 0x62`。下面是一个简单的demo：

```javascript
//example/sample.js
'use strict';
const Stick = require('../index').stick;
const stick = new Stick(1024);
stick.setHeaderLength(4);
const log = (...info) => console.log(new Date(), '', ...info);

stick.onBody(function (body) {
    log('body:', body.toString());
});

const user = { name: 'liuwei', isVip: true };
const data = stick.makeData(JSON.stringify(user));

// 在真实的应用场景中这部分代码在客户端中通过TCP 发送给服务端
// 服务端把接受到的 data,通过 putData 把数据放入 stick
stick.putData(data);
```

Output:

```shell
$ node example/sample.js
2020-07-05T02:26:45.104Z  body: {"name":"liuwei","isVip":true}
```

实际应用场景

```javascript
//example/tcpSample.js
'use strict';
const net = require('net');
const stick_package = require('../index').stick;
const stick = new stick_package(1024);
stick.setHeaderLength(4);

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
```



## 安装

```shell
npm i @lvgithub/stick
```

## 功能介绍

- [x] 提供对 TCP 粘包处理的解决方案
- [x] 默认缓冲 512 个字节，当接收数据超过 512 字节，自动以 512 倍数扩大缓冲空间
- [x] 本默认采用包头两个字节表示包长度
- [x] 默认采用大端接模式接收数据
- [x] 可以配置大端小端读取
- [x] 可以配置自定义包头长度
- [x] 支持自动拆解包

---

## API

- stick(bufferSize) => 直接处理字节类型的包

```
    bufferSize:设置stick处理粘包的缓存空间
```

- stick.setReadIntBE(type) => 设置为大端模式<依据数据包最大值选择合适 type>

```
    setReadIntBE(type)  type:16  包头长度为2,short类型
    setReadIntBE(type)  type:32  包头长度为4,int类型
```

- stick.setReadIntLE => 设置为小端模式<依据数据包最大值选择合适 type>

```
    setReadIntLE(type)  type:16  包头长度为2,short类型
    setReadIntLE(type)  type:32  包头长度为4,int类型
```

- stick.putData(buffer) => 向 stick 中推送需要处理粘包的字节流
- stick.onData(buffer) => 监听 stick 解包好的一个个完整消息(包头+包体),用户自己的数据存储在包体中，如果不想处理包头用 msgCenter 已经封装好
- msgCenter(options) => 可直接发送字符串消息,基于 stick 封装，屏蔽 stick 层需要自己组装包头和拆包头的步骤

```
    options.bufferSize: 设置用户处理粘包的缓存空间
    options.type：设置包头为16位或者32位模式(16|32)
    options.bigEndian: 设置大端、小端字节流模式,默认为打断模式,为false时为小端模式(true|false)
```

- msgCenter.putMsg(msg) => 向消息中心推送字符串消息
- msgCenter.publish(msg) => 发布一个消息,返回一个被打包好的 buffer(包头+包体),用户 clent 发包时使用

```
    msgCenter.publish('123')
    => <Buffer 00 03 31 32 33> // 00 03 包长度  31 32 33 字符串123的ascii码
```

- msgCenter.onMsgRecv(msgHandleFun) => 处理经过粘包处理后的消息

```
    msgHandleFun:业务上处理消息的函数
    msgCenter.onMsgRecv(msg => {
        console.log(`recv data: ` + msg.toString())
        ...do something
    })
```

---

## 更新记录:

- 设置大端,小端接收,添加 setReadIntBE,添加 setReadIntLE 方法
- 支持直接发送字符串消息,自动化组装包头

---

## 使用方法

- 服务端处理粘包

```
    // 默认client.js 采用 msgCenter.publish('...') 向服务端发消息
    // 以下是服务端收到消息后，进行粘包处理
    const MsgCenter = require('stickpackage').msgCenter
    const msgCenter = new MsgCenter()

    // server 监听分包后的消息
    msgCenter.onMsgRecv(data => {
        console.log(`recv data: ` + data.toString())
    })

    // 把 tcp server 监听到的字节流，put到msgCenter中
    msgCenter.putData(Buffer.from([0x00, 0x02, 0x31, 0x32, 0x00, 0x04, 0x31, 0x32, 0x33, 0x34]))
    //=> recv data: 12
    //=> recv data: 1234

```

---

- 发送二进制数据

```
    // 默认client.js 采用 stick 配置的组包式向服务器发送消息
    // 以下是服务端收到消息后，进行粘包处理

    const Stick = require('stickpackage').stick;
    const stick = new Stick(1024).setReadIntBE('16')

    /*
    *  包含两个数据包,10个字节,包头为short，两个字节：[0x00, 0x02],[ 0x00, 0x04]
    *  数据包1:[0x00, 0x02, 0x66, 0x66]
    *  数据包2:[0x00, 0x04, 0x88, 0x02, 0x11, 0x11]
    */
    const data = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

    /*  构造两个buffer
    *   data2_1包含:  第一个数据包的全部数据,第二个数据包的部分数据
    *   data2_2包含:  第二个数据包的剩余数据
    */
    const data2_1 = Buffer.from([0x00, 0x00, 0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
    const data2_2 = Buffer.from([0x11]);

    // 设置收到完整数据触发器
    stick.onData(function (data) {
        console.log('receive data,length:' + data.length);
        console.log(data)
    });

    stick.putData(data);
    stick.putData(data2_1);
    stick.putData(data2_2);

    //  运行结果：
    //  receive data,length:4 <Buffer 00 02 66 66>
    //  receive data,length:6 <Buffer 00 04 88 02 11 11>
    //  receive data,length:2 <Buffer 00 00> receive data, length:4 < Buffer 00 02 66 66> receive data, length:6< Buffer 00 04 88 02 11 11>
```

---

## 案例演示

- tcp client 和 tcp server 之间通过 stick 进行粘包处理通信,详细内容见 example 文件夹
- [tcp-msg]本 demo 主要演示 TCP 中处理粘包的方法，不需要自己组装包头，直接发送和接收文本消息，组包解包操作本类库已经封装在底层

```
// Client.js
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
            console.log(`error:客户端异常断开: ${error}`)
        })
    })

    tcp_server.on('error', function (err) {
        throw err
    })
    tcp_server.listen(8080, function () {
        console.log('tcp_server listening on 8080')
    })
```

- [tcp-buffer]本 demo 主要演示 TCP 中直接处理字节流粘包，展示出如何自己组装包头包体和解包,如不向自己进行组装包头解包操作，请看 demo tcp-msg

```
// Clinet.js
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
```

---

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, ximen (G.doe)

```

## [源码地址，喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stick)

```
