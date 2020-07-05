## 安装

```shell
npm i @lvgithub/stick
```

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

## License

[MIT](http://opensource.org/licenses/MIT)