// test.pack.js
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

stick.onData(function (data) {
    console.log('data:',data.toString());
});
stick.putData(buffer);