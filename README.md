
<div align="left">

![npm](http://img.shields.io/npm/v/@lvgithub/stick.svg?style=flat-square)
![david](https://img.shields.io/david/lvgithub/stick?style=flat-square)
![downloads](https://img.shields.io/npm/dm/@lvgithub/stick.svg?style=flat-square)

</div>


# Introduction

我们使用 TCP 通信的时候，由于TCP是面向流的，因此需要对流进行解析。也就是所谓的拆包，把流解析为一段段我们所需要的数据。本方案为 Node.Js 实现的一个处理方案。

🌈  [喜欢的话 star，订阅 watch~](https://github.com/lvgithub/stick)

🌍  [Solve the problem of "sticking packets" for TCP network transmission (Classic)](https://topic.alibabacloud.com/a/solve-the-problem-font-colorredoffont-quotsticking-font-colorredpacketsfontquot-for-tcp-network-transmission-classic_8_8_31915399.html)
## Schematic

对要发送的数据按协议编码，把数据 `data` 分为 `header` +`body `两部分，header 默认固定长度（_2 byte_），`header`描述的是 `body` 数据的长度。由于`header`定长，因此可以通过`header`，解析出 `body` 的内容。

默认 `header` 我们使用 `2 Byte` 的存储空间，即`Int16`最大表示的 `body` 长度为 `32767`,也就是`16M`。

![Schematic](http://ipic.lightnp.com/schematic.png)

如上图，我们看先取出数据流的前两位，读取到内容 `0x00, 0x02`转化为整数的长度是 2，再读取出`body`第3、4位 `0x61, 0x62`。

## Links

[Install](https://www.npmjs.com/package/@lvgithub/stick)

[Getting Started](https://github.com/lvgithub/stick/blob/master/docs/GettingStarted.md)

[API Reference](https://github.com/lvgithub/stick/blob/master/docs/API.md)

[Examples](https://github.com/lvgithub/stick/blob/master/examples/readme.md)



## More Language

现实场景中客户端是其他语言编写的比如C语言运行在单片机上，这时候大家可以基原理图自行打包，规则所示：

```shell
data = header(body.length) + body
```

## [License](http://opensource.org/licenses/MIT)

![MIT][s2]