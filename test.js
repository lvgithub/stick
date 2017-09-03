var Stick = require('./index');
let stick = new Stick(1024).setReadIntBE('32')

//  构造一个buffer,包含两个数据包，10个字节
let data = Buffer.from([0x00, 0x00, 0x00, 0x02, 0x66, 0x66, 0x00, 0x00, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

/*  构造两个buffer
*   data2_1包含:
*  	第一个数据包的全部数据
* 	第二个数据包的部分数据
*   data2_2包含:
*  	第二个数据包的剩余数据
*/
let data2_1 = Buffer.from([0x00, 0x00, 0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
let data2_2 = Buffer.from([0x11]);

// // 设置收到完整数据触发器
stick.onData(function (data) {
    console.log('receive data,length:' + data.length);
    console.log(data)
});

console.log('Log:传入两个包,一次Put[验证一次性Put数据包]');
stick.putData(data);
console.log('Log:传入两个包,分两次Put[验证分两次Put数据包]');
stick.putData(data2_1);
stick.putData(data2_2);


// // 构造一个512个字节长度的数据。用来测试缓存满的情况
// // let bytes6 = Buffer.from([0x01, 0xfe]);
// // let bytes7 = Buffer.alloc(510).fill(33);

// // 构造一个513个字节长度的数据。用来测试超出缓存的情况
// // let bytes8 = Buffer.from([0x01, 0xff]);
// // let bytes9 = Buffer.alloc(511).fill(33);
// // console.log('log:传入512个字节的数据包[验证缓冲全满情况]');
// // stick.putData(bytes6);
// // stick.putData(bytes7);

// // console.log('log:传入513个字节的数据包[验证缓冲扩增情况]');
// // stick.putData(bytes8);
// // stick.putData(bytes9);

