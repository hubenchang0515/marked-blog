# Linux Hook 技术

Hook 是一种覆盖重写进程中符号的技术，在 Linux 中，通过环境变量 `LD_PRELOAD` 预加载包含同名符号的动态库即可实现。

## 覆盖 malloc 和 free 检查内存泄漏

```c
// 文件名: memcheck.c
// 编译命令: gcc -o memcheck.so memcheck.c --shared -fPIC
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <execinfo.h>

// 打印调用栈的最大深度
#define MAX_STACK_DEPTH 16

typedef struct RecordNode RecordNode;

struct RecordNode
{
    RecordNode* next;
    void* ptr;
    size_t size;
    void* stack_trace[MAX_STACK_DEPTH];
    size_t stack_depth;
};

static RecordNode* head = NULL;                 // 此处头指针不存数据，head->next 才是第一个结点
static RecordNode* tail = NULL;
static void* (*real_malloc)(size_t) = NULL;     // 原 malloc 函数的地址
static void (*real_free)(void*) = NULL;         // 原 free 函数的地址
static bool ignore = false;                     // 忽略内部调用的 malloc

// 打印调用栈
static void printStack(const RecordNode* node)
{
    char** symbols = backtrace_symbols(node->stack_trace, node->stack_depth);
    for (size_t i = 0; i < node->stack_depth; ++i) {
        fprintf(stderr, " [%zu] %s \r\n", i, symbols[i]);
    }
    real_free(symbols);
}

// 打印内存泄漏记录
static void printRecord(void)
{
    ignore = true;
    for (RecordNode* node = head->next; node != NULL; node = node->next)
    {
        fprintf(stderr, "Leak %zu bytes at %p\n", node->size, node->ptr);
        printStack(node);
    }
    ignore = false;
}

// 初始化
static void init()
{
    // 通过 RTLD_NEXT 查找当前进程空间的下一个同名符号来获取原函数地址
    real_malloc = (void*(*)(size_t))dlsym(RTLD_NEXT, "malloc");
    real_free = (void(*)(void*))dlsym(RTLD_NEXT, "free");

    head = (RecordNode*)real_malloc(sizeof(RecordNode));
    head->next = NULL;
    tail = head;
    atexit(printRecord);
}

// 添加记录
static RecordNode* addRecord(void* ptr, size_t size)
{
    RecordNode* node = (RecordNode*)real_malloc(sizeof(RecordNode));
    node->next = NULL;
    node->ptr = ptr;
    node->size = size;
    node->stack_depth = 0;

    tail->next = node;
    tail = node;
    return node;
}

// 删除记录
static void delRecord(void* ptr)
{
    RecordNode* prev = head;
    for (RecordNode* node = head->next; node != NULL; node = node->next)
    {
        if (node->ptr == ptr)
        {
            prev->next = node->next;
            if (node == tail)
                tail = prev;
            real_free(node);
            break;
        }
        prev = node;
    }
}

// hook malloc
void* malloc(size_t size)
{
    if (real_malloc == NULL)
        init();

    void* ptr = real_malloc(size);

    if (!ignore) // 防止内部调用 malloc 导致死循环
    {
        ignore = true;
        RecordNode* node = addRecord(ptr, size);
        node->stack_depth = backtrace(node->stack_trace, MAX_STACK_DEPTH);
        ignore = false;
    }
    return ptr;
}

// hook free
void free(void* ptr)
{
    real_free(ptr);
    delRecord(ptr);
}
```

预加载 `memcheck.so` 来检查内存泄漏:  

> 构建程序（即下述的 test）时在链接选项中添加 `-rdynamic` 选项导出符号表才能显示函数名，否则只能显示地址。

```
$ LD_PRELOAD=./memcheck.so ./test 
Leak 233 bytes at 0x559e563c8350
 [0] ./memcheck.so(malloc+0x7b) [0x7f6546b064a7] 
 [1] ./test(func1+0x12) [0x559e5579215b] 
 [2] ./test(func3+0x12) [0x559e55792185] 
 [3] ./test(main+0x12) [0x559e557921a4] 
 [4] /lib/x86_64-linux-gnu/libc.so.6(+0x29d90) [0x7f6546829d90] 
 [5] /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0x80) [0x7f6546829e40] 
 [6] ./test(_start+0x25) [0x559e55792085] 
Leak 666 bytes at 0x559e563c9560
 [0] ./memcheck.so(malloc+0x7b) [0x7f6546b064a7] 
 [1] ./test(func2+0x12) [0x559e55792170] 
 [2] ./test(func3+0x1c) [0x559e5579218f] 
 [3] ./test(main+0x12) [0x559e557921a4] 
 [4] /lib/x86_64-linux-gnu/libc.so.6(+0x29d90) [0x7f6546829d90] 
 [5] /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0x80) [0x7f6546829e40] 
 [6] ./test(_start+0x25) [0x559e55792085]
```