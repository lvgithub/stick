import { IncomingMessage, ClientRequest } from 'http';
import { CookieJar } from 'tough-cookie';
import { Request } from './request';
import { Response } from './response';
export declare type Types = 'text' | 'buffer' | 'array' | 'uint8array' | 'stream' | string;
export interface Options {
    type?: Types;
    unzip?: boolean;
    jar?: CookieJar;
    agent?: any;
    maxRedirects?: number;
    rejectUnauthorized?: boolean;
    followRedirects?: boolean;
    confirmRedirect?: (request: ClientRequest, response: IncomingMessage) => boolean;
    ca?: string | Buffer | Array<string | Buffer>;
    cert?: string | Buffer;
    key?: string | Buffer;
    maxBufferSize?: number;
}
export declare function createTransport(options: Options): {
    use: ((request: Request, next: () => Promise<Response>) => Promise<never>)[];
    abort: (request: Request) => void;
    open(request: Request): Promise<any>;
};
