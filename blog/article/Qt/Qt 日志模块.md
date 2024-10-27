# Qt 日志模块

旧的方式:  
```cpp
#include <QDebug>

qDebug() << "hello world"
```

现在默认所有日志都不打印，因此这种方式看不到打印  
```
QT_LOGGING_RULES="*.debug=false"
```

新的方式:  
```cpp
#include <QLoggingCategory>

QLoggingCategory category("my.module");
qCDebug(category) << "hello world";
```

需要配置打印哪些模块的日志  
```
QT_LOGGING_RULES="*.debug=false;my.module.debug=true"
```
其中日志类型支持 `debug`, `info`, `warning`, `critical` 四种类型  

`qDebug` 等旧接口所属模块名为 `default`, 因此如下配置可以使旧的方式打印可见:  
```
QT_LOGGING_RULES="*.debug=false;default.debug=true"
```

QtQuick/QML 中 `console.log` 属于 `qml` 或 `js` 模块，因此使用如下配置可以使其打印可见:
```
QT_LOGGING_RULES="*.debug=false;qml.debug=true"
```