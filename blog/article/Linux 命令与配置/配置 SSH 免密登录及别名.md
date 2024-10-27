# 配置 SSH 免密登录及别名

## 免密登录

将 A 主机上的公钥（`~/.ssh/id_rsa.pub`）保存到 B 主机上的 `~/.ssh/authorized_keys` 文件中，即可在 A 主机上免密登录 B 主机。

## 别名

```
Host xxxx                                       # 主机别名
    Hostname xxx.xxx.xxx.xxx                    # 主机名：域名或IP地址
```


### VS Code 上删除 ssh target

无法在 VS Code 上直接删除 ssh target，只能编辑 `~/.ssh/config` 文件来进行删除