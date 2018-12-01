
'use strict';

const Stick = require('./core');

module.exports = function msgCenter(option) {

    option = option || {};
    const bufferSize = option.bufferSize || 1024;
    const type = option.type || 16;
    const bigEndian = option.bigEndian || true;
    const stick = bigEndian ? new Stick(bufferSize).setReadIntBE(type) : new Stick(bufferSize).setReadIntLE(type);

    // 向stick 队列中推送消息
    this.putMsg = function (msg) {
        stick.putMsg(msg);
    };

    // 向stick 队列中推送字节流
    this.putData = function (data) {
        stick.putData(data);
    };

    this.publish = function (msg) {
        return stick.publish(msg);
    };

    this.onMsgRecv = function (msgHandleFun) {

        stick.onData(function (data) {

            const headLen = stick.dataHeadLen;
            const head = new Buffer(headLen);
            data.copy(head, 0, 0, headLen);

            const dataLen = head[stick.readIntMethod]();
            const body = new Buffer(dataLen);
            data.copy(body, 0, headLen, headLen + dataLen);

            msgHandleFun(body);
        });
    };

};



