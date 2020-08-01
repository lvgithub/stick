// example/sample.js
'use strict';
const Stick = require('../../index').Stick;
const stick = new Stick(1024);

const log = (...info) => console.log(new Date(), '', ...info);

stick.onBody(function (body) {
    log('body:', body.toString());
});

const user = { name: 'liuwei', isVip: true };
const data = stick.makeData(JSON.stringify(user));

// 在真实的应用场景中这部分代码在客户端中通过TCP 发送给服务端
// 服务端把接受到的 data,通过 putData 把数据放入 stick
stick.putData(data);
