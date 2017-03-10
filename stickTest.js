var stick = require('./stick');

let buffer = new stick();
let bytes1 = Buffer.alloc(5).fill(33);
let bytes2 = Buffer.alloc(512).fill(33);

let bytes3 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);

let bytes4 = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
let bytes5 = Buffer.from([0x11]);

let bytes6 = Buffer.from([0x01,0xfe]);
let bytes7 = Buffer.alloc(510).fill(33);

buffer.onData(function (data) {
    console.log('receive data,length:' + data.length);
    console.log('receive data,contents:' + JSON.stringify(data));
});

// 传入10个字节,一个长度为2,一个为4的数据包
console.log('传入10个字节,一个长度为2,一个为4的数据包');
buffer.putData(bytes3);

// 传入10个字节,一个长度为2,一个为4的数据包,分两次Put
console.log('传入10个字节,一个长度为2,一个为4的数据包,分两次Put');
buffer.putData(bytes4);
buffer.putData(bytes5);

console.log('传入512个字节的数据包');
buffer.putData(bytes6);
buffer.putData(bytes7);

