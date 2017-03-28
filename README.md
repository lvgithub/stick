#Stickpackage


###  StickPackage，NodeJs中TCP粘包、分包解决方案！

配置介绍

1. 本类库提供对TCP粘包处理的解决方案
2. 本库默认缓冲512个字节，当接收数据超过512字节，自动以512倍数扩大缓冲空间
3. 本库默认采用包头两个字节表示包长度
4. 本库默认采用大端接模式接收数据
5. 本库可以配置自定义包头长度[后期迭代]
6. 本头可以配置大端小端读取[后期迭代]

安装
```
npm i stickpackage
```

源码地址

[喜欢的话请点star，想订阅点watch](https://github.com/lvgithub/stickPackage.git)

---

```
var Stick = require('./stickPackage');
let stick = new Stick();
//  构造一个buffer,包含两个数据包，10个字节
let bytes3 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

/*  构造两个buffer，
*   bytes4包含:
*  	第一个数据包的全部数据
* 	第二个数据包的部分数据
*   bytes5包含:
*  	第二个数据包的剩余数据
*/  	
let bytes4 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
let bytes5 = Buffer.from([0x11]);

// 构造一个512个字节长度的数据。用来测试缓存满的情况
let bytes6 = Buffer.from([0x01, 0xfe]);
let bytes7 = Buffer.alloc(510).fill(33);

// 构造一个513个字节长度的数据。用来测试超出缓存的情况
let bytes8 = Buffer.from([0x01, 0xff]);
let bytes9 = Buffer.alloc(511).fill(33);

// 设置收到完整数据触发器
stick.onData(function (data) {
    console.log('receive data,length:' + data.length);
    console.log('receive data,contents:' + JSON.stringify(data));
});

console.log('log:传入两个包,一次Put[验证一次性Put数据包]');
stick.putData(bytes3);

console.log('log:传入两个包,分两次Put[验证分两次Put数据包]');
stick.putData(bytes4);
stick.putData(bytes5);

console.log('log:传入512个字节的数据包[验证缓冲全满情况]');
stick.putData(bytes6);
stick.putData(bytes7);

console.log('log:传入513个字节的数据包[验证缓冲扩增情况]');
stick.putData(bytes8);
stick.putData(bytes9);

```
