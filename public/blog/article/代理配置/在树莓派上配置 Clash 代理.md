# 在树莓派上配置 Clash 代理

## 编译 clash 源码

```
git clone https://github.com/Dreamacro/clash.git
cd clash
go build
sudo cp clash /usr/bin
```

> 如果遇到依赖包无法下载的问题，可以配置 GOPROXY，参考 [goproxy.io](https://goproxy.io/zh/)。
> ```
> $ export GOPROXY=https://proxy.golang.com.cn,direct
> ```


> 如果遇到 `package embed is not in GOROOT` 的问题，
> 这是因为 debian bullseye 的 golang 版本为 1.15，而 embed 是 1.16 版本新增的。
> 
> 可以安装 bullseye-backports 的版本。
> ```
> $ apt policy golang-go
> golang-go:
>   Installed: 2:1.15~1
>   Candidate: 2:1.15~1
>   Version table:
>      2:1.19~1~bpo11+1 100
>         100 https://mirrors.tuna.tsinghua.edu.cn/debian bullseye-backports/main arm64 Packages
>         100 /var/lib/dpkg/status
>  *** 2:1.15~1 500
>         500 https://mirrors.tuna.tsinghua.edu.cn/debian bullseye/main arm64 Packages
> 
> $ sudo apt install golang-go=2:1.19~1~bpo11+1 golang-src=2:1.19~1~bpo11+1

## 编辑配置文件

配置文件的文件名默认为 `config.yaml`，可以放在任何路径。本文放在 `/etc/clash` 目录中。

## 启动 clash

```
$ clash -d /etc/clash
```

> 如果遇到 `Can't find MMDB, start download` 并且下载失败的问题，可以手动下载并放到配置文件目录中。  
> ```
> $ wget https://cdn.jsdelivr.net/gh/Dreamacro/maxmind-geoip@release/Country.mmdb -P /etc/clash/
> ```

## 配置 systemd service 

创建 `/usr/lib/systemd/system/clash.service` 文件：  

> 如果要配置为用户级服务，则文件路径为 `/usr/lib/systemd/user/clash.service`。
> 
> 后续命令需要附加 `--user` 选项，且不使用 `sudo`。

```ini
[Unit]
Description=Clash proxy
After=syslog.target systemd-user-sessions.service

[Service]
Type=simple
ExecStart=/usr/bin/clash -d /etc/clash
ExecStop=pkill clash
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
```

更新配置   
```
$ sudo systemctl daemon-reload
```

启动 clash  
```
$ sudo systemctl start clash.service
```

查看启动是否成功  
```
$ sudo systemctl status clash.service
```

设置自动启动  
```
$ sudo systemctl enable clash.service
```


## 配置代理

### gsettings

```
$ gsettings set org.gnome.system.proxy mode manual
$ gsettings set org.gnome.system.proxy.http host localhost
$ gsettings set org.gnome.system.proxy.http port 7890
$ gsettings set org.gnome.system.proxy.http enabled true
$ gsettings set org.gnome.system.proxy use-same-proxy true
```

### 环境变量

```
echo 'export all_proxy=localhost:7890' >> ~/.bashrc
```