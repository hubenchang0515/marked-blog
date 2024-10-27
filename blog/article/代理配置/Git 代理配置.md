# Git 代理配置

## HTTP/HTTPS

```
git config --global http.proxy socks://localhost:7890
``` 

> HTTP 和 HTTPS 都使用 `http.proxy`，不存在名为 `https.proxy` 的配置。

配置会写到 `~/.gitconfig` 文件中，也可以通过编辑该文件来进行配置。  

```ini
[user]
        email = hubenchang0515@outlook.com
        name = planc
[http]
        proxy = socks://localhost:7890
```

也可以单独配置指定域名的代理:

```
git config --global http.<URL>.proxy socks://localhost:7890
```

> 注意，HTTP 和 HTTPS 都使用 `http.<URL>.proxy`，设为 `https.<URL>.proxy` 是无效的。

例如:  

```
git config --global http.http://github.com.proxy socks://localhost:7890    # 代理到 http://github.com
git config --global http.https://github.com.proxy socks://localhost:7890   # 代理到 https://github.com
```

```ini
[user]
        email = hubenchang0515@outlook.com
        name = planc
[http "http://github.com"]
        proxy = socks://localhost:7890
[http "https://github.com"]
        proxy = socks://localhost:7890

```

## SSH

使用 SSH 认证时，只能通过 SSH 的配置文件 `~/.ssh/config` 配置代理:  

```
Host github.com
    Hostname github.com
    ServerAliveInterval 55
    ForwardAgent yes
    ProxyCommand nc -x localhost:7890 %h %p
```

> `nc` 是一个命令行程序，用来进行转发。也可以使用 `connect`、`socat`、`corkscrew` 等其他程序，参数的格式也要相应的改变。