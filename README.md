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
// example/tcpSample.js
'use strict';
const net = require('net');
const { Stick, MaxBodyLen } = require('../index');
const stick = new Stick(1024);

// 设置最大传输body大小为 32K，即 header用两个 Byte,最大表示的值为 32767
stick.setMaxBodyLen(MaxBodyLen['32K']);

// server端
const server = net.createServer(socket => {
    // socket 接收到的 片段 put 到 stick 中处理
    socket.on('data', data => {
        stick.putData(data);
    });
    // stick 会解析好一个个数据包，按照接收的顺序输出
    stick.onBody(body => {
        console.log('body:', body.toString());
    });

    server.close();
});
server.listen(8080);

// client 端
const client = net.createConnection({ port: 8080, host: 'localhost' }, () => {
    // 客户端通过 stick 打包内容
    const data = stick.makeData(JSON.stringify({ userName: 'liuwei' }));
    // 然后把打包对的内容通过 TCP 发送给 服务端
    client.write(data);
    client.destroy();
});
```

Output:

```shell
$ node example/sample.js
body: {"userName":"liuwei"}
```



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