#Stickpackage


##  StickPackage，NodeJs中TCP粘包、分包解决方案！

[持续更新，源码地址，喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stickPackage.git)

## 配置介绍

* [x] 提供对TCP粘包处理的解决方案
* [x] 默认缓冲512个字节，当接收数据超过512字节，自动以512倍数扩大缓冲空间
* [x] 本默认采用包头两个字节表示包长度
* [x] 默认采用大端接模式接收数据
* [x] 可以配置大端小端读取
* [x] 可以配置自定义包头长度

## Changes:

* 设置大端,小端接收,添加setReadIntBE,添加setReadIntLE方法:
```
setReadIntBE(type) ,setReadIntLE(type)  type:16  包头长度为2，short类型
setReadIntBE(type) ,setReadIntLE(type)  type:32  包头长度为4，int类型
```
## 安装
```
npm i stickpackage
```
---

## 使用方法
```
const Stick = require('stickpackage');
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

## Example
    tcp客户端和tcp服务的之间通过stick进行粘包处理通信,详细内容见example文件夹

## [源码地址，喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stickPackage.git)
