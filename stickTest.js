var Stick = require('./stickPackage');

let stick = new Stick();

let bytes3 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

let bytes4 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
let bytes5 = Buffer.from([0x11]);
// 512个字节包
let bytes6 = Buffer.from([0x01, 0xfe]);
let bytes7 = Buffer.alloc(510).fill(33);
// 513个字节包
let bytes8 = Buffer.from([0x01, 0xff]);
let bytes9 = Buffer.alloc(511).fill(33);

stick.onData(function (data) {
    console.log('receive data,length:' + data.length);
    console.log('receive data,contents:' + JSON.stringify(data));
    // console.log('receive data,contents:');
});

// 传入10个字节,一个长度为2,一个为4的数据包
console.log('log:传入两个包,一次Put[验证一次性Put数据包]');
stick.putData(bytes3);

// 传入10个字节,一个长度为2,一个为4的数据包,分两次Put
console.log('log:传入两个包,分两次Put[验证分两次Put数据包]');
stick.putData(bytes4);
stick.putData(bytes5);

console.log('log:传入512个字节的数据包[验证缓冲全满情况]');
stick.putData(bytes6);
stick.putData(bytes7);

console.log('log:传入513个字节的数据包[验证缓冲扩增情况]');
stick.putData(bytes8);
stick.putData(bytes9);

