# HTTP(S) 与 SOCKS 代理的区别

首先要区分的是代理类型中 `http` 和代理地址中 `http` 含义的区别。

前者表示 HTTP 协议的传输使用的代理，而后者表示代理使用协议。两者之间并没有任何联系。

例如:  

`http_proxy="http://localhost:7890` 表示 HTTP 协议的传输通过 localhost 的 7890 端口进行代理，代理协议为 HTTP。  
`https_proxy="http://localhost:7890` 表示 HTTPS 协议的传输通过 localhost 的 7890 端口进行代理，代理协议为 HTTP。  
`http_proxy="socks://localhost:7890` 表示 HTTP 协议的传输通过 localhost 的 7890 端口进行代理，代理协议为 SOCKS5。  
`https_proxy="socks://localhost:7890` 表示 HTTPS 协议的传输通过 localhost 的 7890 端口进行代理，代理协议为 SOCKS5。  

## 示例

代理类型为 HTTP，代理协议为 HTTP，发起 HTTP 请求:  

```
$ export http_proxy=http://localhost:7890
$ curl http://www.google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>302 Moved</TITLE></HEAD><BODY>
<H1>302 Moved</H1>
The document has moved
<A HREF="http://www.google.com.hk/url?sa=p&amp;hl=zh-CN&amp;pref=hkredirect&amp;pval=yes&amp;q=http://www.google.com.hk/&amp;ust=1681626703180139&amp;usg=AOvVaw0LzDFyyegwkb2RnuEO-nn1">here</A>.
</BODY></HTML>
```

代理类型为 HTTP，代理协议为 SOCKS5，发起 HTTP 请求:  

```
$ export http_proxy=socks://localhost:7890
$ curl http://www.google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>302 Moved</TITLE></HEAD><BODY>
<H1>302 Moved</H1>
The document has moved
<A HREF="http://www.google.com.hk/url?sa=p&amp;hl=zh-CN&amp;pref=hkredirect&amp;pval=yes&amp;q=http://www.google.com.hk/&amp;ust=1681626703180139&amp;usg=AOvVaw0LzDFyyegwkb2RnuEO-nn1">here</A>.
</BODY></HTML>
```

代理类型为 HTTPS，代理协议为 HTTP，发起 HTTPS 请求:  

```
$ export https_proxy=http://localhost:7890
$ curl https://www.google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>302 Moved</TITLE></HEAD><BODY>
<H1>302 Moved</H1>
The document has moved
<A HREF="http://www.google.com.hk/url?sa=p&amp;hl=zh-CN&amp;pref=hkredirect&amp;pval=yes&amp;q=http://www.google.com.hk/&amp;ust=1681626703180139&amp;usg=AOvVaw0LzDFyyegwkb2RnuEO-nn1">here</A>.
</BODY></HTML>
```

代理类型为 HTTPS，代理协议为 SOCKS5，发起 HTTPS 请求:  

```
$ export https_proxy=socks://localhost:7890
$ curl https://www.google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>302 Moved</TITLE></HEAD><BODY>
<H1>302 Moved</H1>
The document has moved
<A HREF="http://www.google.com.hk/url?sa=p&amp;hl=zh-CN&amp;pref=hkredirect&amp;pval=yes&amp;q=http://www.google.com.hk/&amp;ust=1681626703180139&amp;usg=AOvVaw0LzDFyyegwkb2RnuEO-nn1">here</A>.
</BODY></HTML>
```

也可以不写明代理协议，代理软件会自动判断:  

```
$ export http_proxy=localhost:7890
$ curl http://google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>


$ export https_proxy=localhost:7890
$ curl https://google.com
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://www.google.com/">here</A>.
</BODY></HTML>
```