'use strict';
const Stick = require('../index').stick;
const stick = new Stick(1024).setReadIntBE('16');

// 初始化header内存
const headerBuf = Buffer.alloc(2);
// 初始化数据  <Buffer 61 62>
const dataBuf = Buffer.from('ab');
// 写入数据长度 <Buffer 00 02>
headerBuf.writeInt16BE(dataBuf.length, 0);

console.log('header:', headerBuf);
console.log('dataBuf:',dataBuf);
// <Buffer 00 02 61 62>
const buffer = Buffer.concat([headerBuf,dataBuf]);
console.log('buffer:', buffer);

// 返回 data(header+body) 数据
stick.onData(function (data) {
    // data: <Buffer 00 02 61 62>
    console.log('data:',data);
});

// 只返回 body 部分数据
stick.onBody(function (body) {
    // body: <Buffer 61 62>
    console.log('body:', body);
    // body str: ab
    console.log('body str:',body.toString());
});

stick.putData(buffer);