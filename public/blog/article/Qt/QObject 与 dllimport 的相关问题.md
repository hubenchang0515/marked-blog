# QObject 与 dllimport 的相关问题

Qt 的元对象编译（MOC）系统会根据标记了 `Q_OBJECT` 的类生成代码。由于类通常在头文件中，因此通常需要将头文件加入编译。  

```cmake
add_library(lib SHARED lib.h lib.cpp)
```

在 Windows 上引用 lib 时，可能会遇到 staticMetaObject 符号未定义的错误。  

```cmake
add_executable(demo main.cpp)
```

即使创建动态库时，将 `CMAKE_EXPORT_ALL_SYMBOLS` 设为 `ON` 也不行。  

```cmake
set(CMAKE_EXPORT_ALL_SYMBOLS ON)
add_library(lib SHARED lib.h lib.cpp)
```

这是因为只有函数符号可以自动导入，而staticMetaObject 是静态数据成员，全局数据必须通过 __declspec(dllimport) 手动导入。  

参考 [CMake 文档](https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html)。  

正确的解决办法是声明 dllexport 和 dllimport

```c++
#ifdef BUILD_SHARED
    #define DLL_EXPORT __declspec(dllexport)
#else
    #define DLL_EXPORT __declscpe(dllimport)
#endif

class DLL_EXPORT XXX : public QObject
{
    Q_OBJECT
};
```

不清楚这个机制的人可能会在外部项目中将 lib.h 加入编译，这样错误也会消失，因为 lib.h 重新 moc 并编译了一份。

```cmake
add_executable(demo main.cpp lib.h)
```

但这是错误的解决办法，这将导致外部项目和库中的 staticMetaObject 是不同的对象。  

并且，如果引用的头文件中已经声明了 `DLL_EXPORT`，同时外部项目不是 `BUILD_SHARED`（例如构建可执行程序）。此时 `DLL_EXPORT` 将被解析为 `__declscpe(dllimport)`，从而导致头文件报 `不允许 dllimport 静态数据成员 staticMetaObject` 的错误。