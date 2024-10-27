# Cargo 代理配置

编辑 `~/.cargo/config` 文件:  

```ini
# 将 crates-io 替换为中科大镜像
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
#registry = "https://mirrors.ustc.edu.cn/crates.io-index"

# 代理配置，git 也会使用这个配置
[http]
proxy = "socks://localhost:7890"

[https]
proxy = "socks://localhost:7890"
```