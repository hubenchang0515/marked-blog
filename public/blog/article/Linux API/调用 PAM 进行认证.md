# 调用 PAM 进行认证

```c
// gcc main.c -lpam

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <termio.h>
#include <security/pam_appl.h>

/***************************************
 * @brief 开关回显 
 * @param[in] fd 文件描述符
 * @param[in] off 1-关闭回显，0-开启回显
 * *************************************/
static void echoOff(int fd, int off)
{
    struct termio tty;
    (void) ioctl(fd, TCGETA, &tty);
    if (off) 
    {
        tty.c_lflag &= ~(ECHO | ECHOE | ECHOK | ECHONL);
        (void) ioctl(fd, TCSETAF, &tty);
    }
    else
    {
        tty.c_lflag |= (ECHO | ECHOE | ECHOK | ECHONL);
        (void) ioctl(fd, TCSETAW, &tty);
    }
}

/***************************************
 * @brief 关闭标准输入的回显 
 * *************************************/
static void echoOffStdin()
{
    echoOff(fileno(stdin), 1);
}

/***************************************
 * @brief 开启标准输入的回显 
 * *************************************/
static void echoOnStdin()
{
    echoOff(fileno(stdin), 0);
}

/***************************************
 * @brief 读取一行输入
 * @return 输入的字符串
 * *************************************/
static char* readline()
{
    struct termio tty;
    char input[PAM_MAX_RESP_SIZE];

    /* 读取字符直到回车 */
    flockfile(stdin);
    int i = 0;
    for (; i < PAM_MAX_RESP_SIZE; i++)
    {
        int ch = getchar_unlocked();
        if (ch == '\n' || ch == '\r' ||ch == EOF)
            break;
        input[i] = ch;
    }
    funlockfile(stdin);
    input[i] = '\0';

    return (strdup(input));
}

/**************************************************
 * @brief PAM对话回调函数
 * @param[in] num_msg PAM发送过来的消息数量
 * @param[in] msg PAM发送过来的消息数据 
 * @param[out] resp 发回给PAM的应答
 * @param[in] appdata_ptr 用户参数 
 * @return 状态 
 * ************************************************/
static int conversation(int num_msg, const struct pam_message** msg, struct pam_response **resp, void *appdata_ptr)
{
    // 检查参数
    if (num_msg <= 0 || num_msg >= PAM_MAX_MSG_SIZE)
    {
        fprintf(stderr, "invalid num_msg(%d)\n", num_msg);
        return PAM_CONV_ERR;
    }

    // 给回复消息分配内存，这里分配的内存，由外层的 PAM 框架释放
    // TODO: 发生错误的时候需要手动释放
    if ((resp[0] = malloc(num_msg * sizeof(struct pam_response))) == NULL)
    {
        fprintf(stderr, "bad alloc\n");
        return PAM_BUF_ERR;
    }

    // 处理PAM发来的消息并应答
    for(int i = 0; i < num_msg; i++)
    {
        const struct pam_message* m = *msg + i;
        struct pam_response* r = *resp + i;
        r->resp_retcode = 0;    // 这个是保留属性，固定为0
        switch (m->msg_style)
        {
        case PAM_PROMPT_ECHO_OFF:   // 请求输入，不回显，例如请求输入用户名
            printf("%s", m->msg);
            echoOffStdin();         // 关闭回显
            r->resp = readline();   // 读取密码
            echoOnStdin();          // 开启回显
            printf("\n");           // 补个换行
            break;

        case PAM_PROMPT_ECHO_ON:    // 请求输入，回显，例如请求输入密码
            printf("%s", m->msg);
            r->resp = readline();
            break;

        case PAM_TEXT_INFO:         // 打印普通消息
            printf("%s\n", m->msg);
            break;

        case PAM_ERROR_MSG:         // 打印错误消息
            fprintf(stderr, "%s\n", m->msg);
            break;

        default:
            printf("DEFAULT\n");
            break;
        }
    }
    return PAM_SUCCESS;
}

int main()
{
    atexit(echoOnStdin); // 退出时开启回显

    struct pam_conv pam_conv = {conversation, NULL};
    pam_handle_t *pamh;
    if (PAM_SUCCESS != pam_start("login", NULL, &pam_conv, &pamh))
    {
        fprintf(stderr, "pam_start failed\n");
        return EXIT_FAILURE;
    }

    if (PAM_SUCCESS != pam_authenticate(pamh, 0))
    {
        fprintf(stderr, "pam_authenticate failed\n");
        pam_end(pamh, 0);
        return EXIT_FAILURE;
    }
    
    pam_end(pamh, 0);
    return EXIT_SUCCESS;
}
```