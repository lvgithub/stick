- ## Class: Stick

    - **new Stick(bufferSize: number)**

        Stick 类用于处理数据包，从流中解析出用户定义的一块快数据

        * **bufferSize** Stick处理数据包初始化的缓存大小，默认 512 Bytes

        

    - **putData(buf: Buffer)**

        往 stick 中put 收到的数据流

        

    - **onData(callback)**

        当收到的数据流中包含了完整的数据块，触发回调返回数据块（`header`+`body`）

        * **callback**: (buf: Buffer): void

        

    - **onBody(callback)**

        当收到的数据流中包含了完整的数据块，触发回调返回数据内容（`body`）

        

    - **makeData(body: string): Buffer**

        用于客户端中，帮助生成符合 Stick 协议的数据块（`data`）

        

    - **setMaxBodyLen(length: MaxBodyLen)**

        设置`body` 的最大长度，提供两种配置见 ** MaxBodyLen**

* #### **Enum: MaxBodyLen**

    * **32K**  最大32kb
    * **2048M** 最大 2048M 