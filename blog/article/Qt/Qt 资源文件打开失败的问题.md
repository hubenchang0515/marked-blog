# Qt 资源文件打开失败的问题

首先，Qt 的资源文件需要使用 `Q_INIT_RESOURCE` 宏进行初始化，参数为 `qrc` 文件的文件名，例如:  

```c++
Q_INIT_RESOURCE(theme);   // 初始化 theme.qrc
Q_INIT_RESOURCE(icon);    // 初始化 icon.qrc
```

并且，这个宏必须在全局命名空间下调用，例如:  

```c++
static inline void initResource()
{
    Q_INIT_RESOURCE(theme);   // 初始化 theme.qrc
    Q_INIT_RESOURCE(icon);    // 初始化 icon.qrc
}

namespace DemoNamespace
{

class DemoClass
{

public:
    DemoClass()
    {
        initResource(); // 调用初始化函数
    }

};

};
```

并且，可以使用 `Q_CLEANUP_RESOURCE` 宏来显式删除资源。

> `Q_INIT_RESOURCE` 仅在将资源构建为静态库时是必须的，在构建动态库和应用程序中时可以省略。

但是我遇到的是另一个问题 —— **Qt 的资源集合文件不能重名**

在库中创建了名为 `theme.qrc` 的资源集合文件，之后在应用程序中再次创建一个名为 `theme.qrc` 的资源集合文件。库的 `theme.qrc` 会失效。

> 这个问题仅在 Linux 上存在，而在 Windows 上不存在。因此无法确定是 Feature 还是 Bug。