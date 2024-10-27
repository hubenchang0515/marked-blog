# hexdump 格式化

hexdump 常用的选项有三个：跳过的字节数（`-s`）、打印的字节数（`-n`）和打印的格式(`-e`)
```
hexdump [-s SKIP_BYTES] [-n BYTES] [-e FORMAT] 
```

其中 FORMAT 的格式为 `'m/n "F"'`，其中 `m` 为一组打印多少个元素，`n`为一个元素的字节数。 `F` 支持 C 语言中 printf 相同的格式,并且额外持支以下格式:  

| 格式      | 说明 |
| :-       |  :-  |
| %_a[dox] | 地址，d、o、x分别表示十进制、八进制和十六进制 |
| %_A[dox] | 地址（仅在最后打印），d、o、x分别表示十进制、八进制和十六进制 |
| %_c      | 默认字符集字符，非文本字符打印三位八进制数 |
| %_p      | 默认字符集字符，非文本字符打印 . |
| %_u      | ASCII字符，控制字符打印名称，其他非文本字符打印十六进制数 |

> FORMAT 可以有多个，m 和 n 可以省略。

示例:  

```bash
$ hexdump data.bin # 默认打印
0000000 3b98 bcbc abdf 0001 cded 08ef 0ac6 e1e0
0000010 b584 c2c4 41a5 5f14 3ad6 ba58 0533 8757
0000020
$ hexdump data.bin -e '"%06_ax " 8/2 "%04x " "\n" "%06_Ax\n"' # 地址-8个2字节十六进制整数-换行 --- 最后再打印一次地址
000000 3b98 bcbc abdf 0001 cded 08ef 0ac6 e1e0
000010 b584 c2c4 41a5 5f14 3ad6 ba58 0533 8757
000020
```

参考:  

[hexdump - FORMATS](https://man7.org/linux/man-pages/man1/hexdump.1.html#FORMATS)