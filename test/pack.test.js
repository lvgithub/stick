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

// <Buffer 00 02 61 62>
const buffer = Buffer.concat([headerBuf, dataBuf]);
const buffer2 = Buffer.concat([headerBuf, Buffer.from('cd')]);

let count = 1;
test('test stick onData', async (done) => {
    stick.onData(function (data) {
        count === 1 && expect(data.toString()).toBe(buffer.toString());
        count === 2 && expect(data.toString()).toBe(buffer2.toString());
        count++;
        done();
    });
    stick.putData(buffer);
    stick.putData(buffer2);
});
let count2 = 1;

test('test stick onBody', async (done) => {
    stick.onBody(function (data) {
        count2 === 1 && expect(data.toString()).toBe('ab');
        count2 === 2 && expect(data.toString()).toBe('cd');
        count2++;
        done();
    });
    stick.putData(buffer);
    stick.putData(buffer2);
});

