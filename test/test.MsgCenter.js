'use strict'

const MsgCenter = require('../index').msgCenter
const msgCenter = new MsgCenter()

msgCenter.onMsgRecv(msg => {
    console.log(`recv data: ` + msg.toString())
})

msgCenter.putMsg('234')
msgCenter.putData(Buffer.from([0x00, 0x02, 0x31, 0x32, 0x00, 0x04, 0x31, 0x32, 0x33, 0x34]))

// console.log(msgCenter.publish('123'))
