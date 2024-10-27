# Ubuntu 上配置 QtQuick/QML 开发环境

安装以下包:  
```
sudo apt install qtbase5-dev              # Qt5 基础开发包
sudo apt install qtquickcontrols2-5-dev   # QtQuick 基础开发包
sudo apt install qtdeclarative5-dev       # Qt5 的 CMake 模块

sudo apt install qtcreator                # Qt Creator
sudo apt install qttools5-dev             # Qt5 工具，包含 Qt5Designer、Qt5LinguistTools 等
sudo apt install qmlscene                 # QML 预览工具
```

QML 导入失败时，表示没有安装对应的模块，deb 包名为 `qml-module-*`。

例如 `QtQuick.Dialogs` 的 deb 包名为 `qml-module-qtquick-dialogs`。

# 遇到的一些问题

最初安装的包:  
```bash
sudo apt install qtbase5-dev
sudo apt install qtquickcontrols2-5-dev
sudo apt install qtcreator
```

## 执行 CMake 失败

```
  Could not find a package configuration file provided by "Qt5Quick" 
  with any of the following names:

    Qt5QuickConfig.cmake
    qt5quick-config.cmake
```

原因: 没有安装 Qt 的 CMake 模块  
解决: `sudo apt install qtdeclarative5-dev`  

```
  Could not find a package configuration file provided by "Qt5LinguistTools"
  with any of the following names:

    Qt5LinguistToolsConfig.cmake
    qt5linguisttools-config.cmake
```
原因: 没有安装 Qt5 Linguist Tools 的 CMake 模块
解决: `sudo apt install qttools5-dev`  

## 导入 QtQuick.Controls 2 失败

```
QQmlApplicationEngine failed to load component
qrc:/main.qml:2:1: plugin cannot be loaded for module "QtQuick.Controls": Cannot protect module QtQuick.Controls 2 as it was never registered
```

原因: 没有安装 QtQuick.Controls 2 的运行时环境  
解决: `sudo apt install qml-module-qtquick-controls2`  


## 导入 QtQuick.Dialogs 失败

```
module "QtQuick.Dialogs" is not installed
```

原因: 没有安装 QtQuick.Dialogs
解决: `sudo apt install qml-module-qtquick-dialogs`  