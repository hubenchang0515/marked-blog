# Windows 程序删除 CMD 窗口

需要将项目类型设为桌面程序。此时入口函数默认为 `WinMainCRTStartup`，它会在初始化后调用 `WinMain` 而不是 `main`。
可以将入口函数修改为 `mainCRTStartup` 来调研 `main`。

VS 的链接选项:  

```
:/SUBSYSTEM:windows;/ENTRY:mainCRTStartup
```

MinGW 的链接选项:  

```
-mwindows -lmingw32
```