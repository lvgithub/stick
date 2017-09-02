#Stickpackage


###  StickPackage，NodeJs中TCP粘包、分包解决方案！

[持續更新，源码地址，喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stickPackage.git)
配置介绍

* [x] 提供对TCP粘包处理的解决方案
* [x] 默认缓冲512个字节，当接收数据超过512字节，自动以512倍数扩大缓冲空间
* [x] 本默认采用包头两个字节表示包长度
* [x] 默认采用大端接模式接收数据
* [x] 可以配置大端小端读取
* [x] 可以配置自定义包头长度

Changes:

*　* 设置大端,小端接收,添加setReadIntBE,添加setReadIntLE方法:
```
     setReadIntBE(16) ,setReadIntLE(16) 
     * type:16  包头长度为2，short类型
     setReadIntBE(32) ,setReadIntLE(32)
     * type:32  包头长度为4，int类型
```
安装
```
npm i stickpackage
```
---

使用方法
```
const Stick = require('./stickPackage');
const stick = new Stick( {bufferLength:1024} ).setReadIntBE(16);
#const stick = new Stick( {bufferLength:1024} ).setReadIntBE(32);

# 收到完整数据触发
stick.onData(function (data) {
    console.log('receive data,length:' + data.length);
    console.log('receive data,contents:' + JSON.stringify(data));
});

# 构造一个buffer,包含两个数据包，10个字节
# data1 [0x00, 0x02, 0x66, 0x66] 0x00 0x02 代表的是包长度为2
# data2 [0x00, 0x04, 0x88, 0x02, 0x11, 0x11] 0x00 0x04 代表的是包长度为4

let bytes = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]); 

# 处理粘包
stick.putData(bytes);

# 结果显示
# receive data,length:4
# receive data,contents:{"type":"Buffer","data":[0,2,102,102]} 

# receive data,length:6
# receive data,contents:{"type":"Buffer","data":[0,4,136,2,17,17]}

```


[源码地址，喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stickPackage.git)
