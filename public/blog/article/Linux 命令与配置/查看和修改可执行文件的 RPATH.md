# 查看和修改可执行文件的 RPATH

查看:

```bash
readelf -d $EXEC | grep runpath
```

修改:

```bash
chrpath -r $RPATH $EXEC
```

编译时设置 rpath:  

```bash
gcc -o $EXEC $SOURCE -Wl,-rpath=$RPATH
```

设置 rpath 时可以使用 `$ORIGIN` 来表示可执行文件本身所在路径