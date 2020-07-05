export enum MaxBodyLen {
    '32K',
    '2048M'
}

declare function callback(buf: Buffer): void
export class Stick {
    constructor(bufferSize: number)
    putData(buf: Buffer)
    onData(callback)
    onBody(callback)
    makeData(body: string): Buffer
    setMaxBodyLen(length: MaxBodyLen)
}