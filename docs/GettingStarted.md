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

## Output

```
$ node example/sample.js
body: {"userName":"liuwei"}
```



