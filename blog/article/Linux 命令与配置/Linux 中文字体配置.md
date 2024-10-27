# 字体设置

下载字体文件:

* [思源黑体](https://github.com/adobe-fonts/source-han-sans/releases)
* [思源等宽](https://github.com/adobe-fonts/source-han-mono/releases)

## 安装到用户目录
将字体文件复制到用户字体目录 `~/.local/share/fonts/` 

## 安装到系统目录

> 系统目录中通过目录区对字体进行分组，可以手动创建文件夹 

思源等宽（SourceHanMono.ttc）是 TrueType 字体，复制到 `/usr/share/fonts/truetype/source-han`  
思源黑体（SourceHanSansCN-Normal.otf）是 OpenType 字体，复制到 `/usr/share/fonts/opentype/source-han`  

## 查看字体

使用 `fc-list` 命令可以查看已安装的字体:  

```
$ fc-list | grep -i source
/home/planc/.local/share/fonts/SourceHanSansSC-VF.otf: Source Han Sans SC VF:style=Regular
/usr/share/fonts/truetype/source-han: Source Han Mono SC,思源等宽:style=Regular
/usr/share/fonts/truetype/source-han: Source Han Mono TC,思源等寬:style=Regular
/usr/share/fonts/truetype/source-han: Source Han Mono HC,思源等寬 香港:style=Regular
```

> 其中 SC 是简体中文（Simplified Chinese）的缩写

## 设置系统字体
字体设置有三个：
* 标准字体 `font-name` - 通常情况下使用的字体
* 等宽字体 `monospace-font-name` - 要求字符等宽时使用的字体，例如终端和一些代码编辑器
* 文档字体 `document-font-name` - 打印时使用的字体

```
$ gsettings set org.gnome.desktop.interface font-name 'Source Han Sans CN 11'
$ gsettings set org.gnome.desktop.interface monospace-font-name 'Source Han Mono SC 11'
$ gsettings set org.gnome.desktop.interface document-font-name 'Source Han Sans CN 11'
```

## 设置应用字体

应用软件既可以读取系统配置使用系统字体，也可以自己决定使用的字体。有些软件完全不会读取系统字体配置，只能在软件内设置字体。  
以 VSCode 为例，在其配置文件（`~/.config/Code/User/settings.json`）中添加 `"editor.fontFamily": "'Source Han Mono SC',` 来配置字体。