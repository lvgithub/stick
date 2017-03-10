///<reference path='node.d.ts'/>
//import net = require('net');
import events = require('events');

// let eventEmitter = new events.EventEmitter();

// eventEmitter.on('data', function (data) {
//     console.log('data');
// });

// eventEmitter.emit('da');

export class StickPackage extends events.EventEmitter {
    constructor(public ss: string) {
        super();
    }
    private test(): void {
        this.on('data', function () {
            console.log('data emit');
        })
        this.emit('data');
    }
}

// var ss = new StickPackage();

