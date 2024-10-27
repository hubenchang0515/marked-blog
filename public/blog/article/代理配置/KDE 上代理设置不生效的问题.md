# KDE 上代理设置不生效的问题

KDE 的系统设置中已经提示了，一些应用程序可能不会使用这个代理。因为在 Linux 上有很多配置代理的方式，不同的应用程序可能读取了不同的配置。
而 KDE 的系统设置使用的是自家的 **KConfig**，基本只有 KDE 自己支持，很少有其他应用程序兼容。

```
$ kreadconfig5 --file kioslaverc --group 'Proxy Settings' --key httpProxy
localhost 7890

$ cat /home/planc/.config/kioslaverc 
ProxyUrlDisplayFlags=15

[Proxy Settings]
NoProxyFor=
Proxy Config Script=
ProxyType=1
ReversedException=false
ftpProxy=localhost 7890
httpProxy=localhost 7890
httpsProxy=localhost 7890
socksProxy=localhost 7890
```

大部分应用程序采用 **gsettings** 中的代理配置:  

```
$ gsettings list-recursively | grep proxy
org.gnome.evolution.shell.network-config proxy-type 0
org.gnome.evolution.shell.network-config use-http-proxy false
org.gnome.system.proxy autoconfig-url ''
org.gnome.system.proxy ignore-hosts ['localhost', '127.0.0.0/8', '::1']
org.gnome.system.proxy mode 'manual'
org.gnome.system.proxy use-same-proxy true
org.gnome.system.proxy.ftp host 'localhost'
org.gnome.system.proxy.ftp port 7890
org.gnome.system.proxy.http authentication-password ''
org.gnome.system.proxy.http authentication-user ''
org.gnome.system.proxy.http enabled false
org.gnome.system.proxy.http host 'localhost'
org.gnome.system.proxy.http port 7890
org.gnome.system.proxy.http use-authentication false
org.gnome.system.proxy.https host 'localhost'
org.gnome.system.proxy.https port 7890
org.gnome.system.proxy.socks host 'localhost'
org.gnome.system.proxy.socks port 7890
```

少数应用程序使用环境变量中的代理配置:  

```
$ env | grep proxy
no_proxy=localhost,127.0.0.0/8,::1
ftp_proxy=http://localhost:7890/
https_proxy=http://localhost:7890/
http_proxy=http://localhost:7890/
all_proxy=socks://localhost:7890/
```