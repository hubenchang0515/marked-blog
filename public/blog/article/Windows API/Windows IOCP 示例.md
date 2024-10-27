# Windows IOCP 示例

这个示将接收到的数据原样返回给客户端:  

```c++
#include <WinSock2.h>
#include <WS2tcpip.h>
#include <MSWSock.h>
#include <cstdio>

#define BUFFER_SIZE 1024

enum class IocpType
{
    ACCEPT,
    RECV,
    SEND
};

struct IocpContext : public WSAOVERLAPPED
{
    IocpContext() : 
        WSAOVERLAPPED{}
    {

    }

    WSABUF wsaBuf{BUFFER_SIZE, buffer};
    char buffer[BUFFER_SIZE];
    SOCKET sock;
    IocpType type;
};

// 提交一个异步的 accept 操作
bool postAccpet(SOCKET server)
{
    // 创建上下文
    IocpContext* ctx = new IocpContext;
    ctx->type = IocpType::ACCEPT;

    // 创建接收连接的socket
    ctx->sock = WSASocketW(AF_INET, SOCK_STREAM, IPPROTO_TCP, nullptr, 0, WSA_FLAG_OVERLAPPED);
    if (ctx->sock == SOCKET_ERROR)
    {
        fprintf(stderr, "WSASocketW: %s\n", strerror(WSAGetLastError()));
        closesocket(ctx->sock);
        return false;
    }

    // 加载 AcceptEX 函数
    LPFN_ACCEPTEX lpfnAcceptEx = NULL;
    GUID GuidAcceptEx = WSAID_ACCEPTEX;
    DWORD dwBytes;
    {
        int ret = WSAIoctl(server, SIO_GET_EXTENSION_FUNCTION_POINTER,
                            &GuidAcceptEx, sizeof (GuidAcceptEx), 
                            &lpfnAcceptEx, sizeof (lpfnAcceptEx), 
                            &dwBytes, NULL, NULL);
        if (ret == SOCKET_ERROR)
        {
            fprintf(stderr, "WSAIoctl: %s\n", strerror(WSAGetLastError()));
            closesocket(ctx->sock);
            return false;
        }
    }
    
    // 通过 AcceptEx 发起异步的 accept 操作
    {
        DWORD addrlen = sizeof(struct sockaddr_in);
        DWORD recvlen;
        BOOL ret = lpfnAcceptEx(server, 
                                ctx->sock, 
                                ctx->buffer, 
                                BUFFER_SIZE - 2*(addrlen+16), 
                                addrlen + 16, 
                                addrlen + 16, 
                                &recvlen, 
                                ctx);
        if (!ret && WSAGetLastError() != ERROR_IO_PENDING)
        {
            fprintf(stderr, "AcceptEx: %s\n", strerror(WSAGetLastError()));
            closesocket(ctx->sock);
            return false;
        }
    }

    return true;
}

// 提交一个异步的 RECV 操作
bool postRecv(SOCKET sock)
{
    IocpContext* ctx = new IocpContext;
    ctx->sock = sock;
    ctx->type = IocpType::RECV;
    DWORD nBytes = BUFFER_SIZE;
    DWORD flags = 0;
    int ret = WSARecv(sock, &(ctx->wsaBuf), 1, &nBytes, &flags, ctx, nullptr);
    if (ret == SOCKET_ERROR && WSAGetLastError() != ERROR_IO_PENDING)
    {
        fprintf(stderr, "WSARecv: %s\n", strerror(WSAGetLastError()));
        return false;
    }

    return true;
}

// 提交一个异步的 SEND 操作
bool postSend(SOCKET sock, const char* data, DWORD size)
{
    IocpContext* ctx = new IocpContext;
    ctx->sock = sock;
    ctx->type = IocpType::SEND;
    memcpy(ctx->buffer, data, size);
    DWORD nBytes = size;
    ctx->wsaBuf.len = size;
    DWORD flags = 0;
    int ret = WSASend(sock, &(ctx->wsaBuf), 1, &nBytes, flags, ctx, nullptr);
    if (ret == SOCKET_ERROR && WSAGetLastError() != ERROR_IO_PENDING)
    {
        fprintf(stderr, "WSASend: %s\n", strerror(WSAGetLastError()));
        return false;
    }

    return true;
}

int main()
{
    WSAData wsa;
    if (WSAStartup(0x202, &wsa) != NO_ERROR)
    {
        fprintf(stderr, "WSAStartup failed\n");
        return EXIT_FAILURE;
    }

    // 创建服务socket
    SOCKET server = WSASocketW(AF_INET, SOCK_STREAM, IPPROTO_TCP, nullptr, 0, WSA_FLAG_OVERLAPPED);
    if (server == INVALID_SOCKET)
    {
        fprintf(stderr, "WSASocketW: %s\n", strerror(WSAGetLastError()));
        WSACleanup();
        return EXIT_FAILURE;
    }
    
    // 设为非阻塞
    unsigned long value = 1;
    if (ioctlsocket(server, FIONBIO, &value) == SOCKET_ERROR)
    {
        fprintf(stderr, "ioctlsocket: %s\n", strerror(WSAGetLastError()));
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    // 绑定端口
    struct sockaddr_in address {};
    address.sin_family = AF_INET;
    address.sin_port = htons(8080);
    inet_pton(AF_INET, "127.0.0.1", &address.sin_addr);
    if (bind(server, (const sockaddr*)(&address), sizeof(address)) == SOCKET_ERROR)
    {
        fprintf(stderr, "bind: %s\n", strerror(WSAGetLastError()));
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    // 监听
    if (listen(server, SOMAXCONN) == SOCKET_ERROR)
    {
        fprintf(stderr, "listen: %s\n", strerror(WSAGetLastError()));
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    // 创建 IOCP handle
    HANDLE handle = CreateIoCompletionPort(INVALID_HANDLE_VALUE, nullptr, 0, 0);
    if (handle == INVALID_HANDLE_VALUE)
    {
        fprintf(stderr, "CreateIoCompletionPort: %s\n", strerror(WSAGetLastError()));
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    // 将 server 绑定到 IOCP 上
    if (CreateIoCompletionPort(reinterpret_cast<HANDLE>(server), handle, 0, 0) == nullptr)
    {
        fprintf(stderr, "CreateIoCompletionPort: %s\n", strerror(WSAGetLastError()));
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    // 提交一个异步的 accept 操作
    if (postAccpet(server) == false)
    {
        closesocket(server);
        WSACleanup();
        return EXIT_FAILURE;
    }

    while (true)
    {
        // 等待操作完成
        IocpContext* ctx = nullptr;
        DWORD lpNumberOfBytesTransferred = 0;
        void* lpCompletionKey = nullptr;
        {
            BOOL ret = GetQueuedCompletionStatus(
                        handle,
                        &lpNumberOfBytesTransferred,
                        (PULONG_PTR) &lpCompletionKey,
                        (LPOVERLAPPED *) &ctx,
                        INFINITE);
            if (!ret)
                continue;
        }
        
        // 处理 ACCEPT 操作
        if (ctx->type == IocpType::ACCEPT)
        {   
            // 重新发起一个异步的 accept 操作，接收下一个连接
            postAccpet(server);

            // 将连接设为非阻塞
            unsigned long value = 1;
            if (ioctlsocket(ctx->sock, FIONBIO, &value) == SOCKET_ERROR)
            {
                fprintf(stderr, "ioctlsocket: %s\n", strerror(WSAGetLastError()));
                closesocket(ctx->sock);
                delete ctx;
                continue;
            }

            // 将连接绑定到 IOCP 上
            if (CreateIoCompletionPort(reinterpret_cast<HANDLE>(ctx->sock), handle, 0, 0) == nullptr)
            {
                fprintf(stderr, "CreateIoCompletionPort: %s\n", strerror(WSAGetLastError()));
                closesocket(ctx->sock);
                delete ctx;
                continue;
            }

            // 发起一个异步的 send 操作，NOTE: AcceptEx 会读取第一帧数据
            if (lpNumberOfBytesTransferred > 0)
                postSend(ctx->sock, ctx->buffer, lpNumberOfBytesTransferred);

            // 发起一个异步的 recv 操作，接受后续数据
            if (postRecv(ctx->sock) == false)
            {
                closesocket(ctx->sock);
                delete ctx;
                continue;
            }

            delete ctx;
            continue;
        }

        // 处理 RECV 操作
        if (ctx->type == IocpType::RECV)
        {
            // 连接出错或断开
            if (lpNumberOfBytesTransferred <= 0)
            {
                closesocket(ctx->sock);
                delete ctx;
                continue;
            }

            // 发起一个异步的 send 操作
            postSend(ctx->sock, ctx->buffer, lpNumberOfBytesTransferred);

            // 发起一个异步的 recv 操作，接收后续数据
            if (postRecv(ctx->sock) == false)
            {
                closesocket(ctx->sock);
                delete ctx;
                continue;
            }

            delete ctx;
            continue;
        }

        // 处理 SEND 操作
        if (ctx->type == IocpType::SEND)
        {
            delete ctx;
            continue;
        }
    }
}
```

使用 Apache HTTP server benchmarking tool 进行测试，结果如下:  

```
Server Software:
Server Hostname:        localhost
Server Port:            8080

Document Path:          /
Document Length:        0 bytes

Concurrency Level:      10000
Time taken for tests:   207.340 seconds
Complete requests:      10000000
Failed requests:        0
Non-2xx responses:      10000000
Keep-Alive requests:    10000000
Total transferred:      1060000000 bytes
HTML transferred:       0 bytes
Requests per second:    48229.98 [#/sec] (mean)
Time per request:       207.340 [ms] (mean)
Time per request:       0.021 [ms] (mean, across all concurrent requests)
Transfer rate:          4992.56 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0      16
Processing:   114  205  19.3    204    1214
Waiting:        0  205  19.3    204    1214
Total:        114  205  19.3    204    1214

Percentage of the requests served within a certain time (ms)
  50%    204
  66%    205
  75%    206
  80%    206
  90%    208
  95%    210
  98%    212
  99%    213
 100%   1214 (longest request)
```