'use strict';

const stick = require('./lib/core');
const msgCenter = require('./lib/msgCenter');

module.exports = {
    stick,
    msgCenter,
    Stick: stick,
    MaxBodyLen: {
        '32K': 2, // max: 32767  body:16M
        '2048M': 4  // max: 2147483647
    }
};
