# 进程

## 查看进程
```bash
##一、查看指定端口的进程
sudo lsof -i :27017

COMMAND   PID    USER        FD      TYPE             DEVICE             SIZE/OFF      NODE       NAME
[mongod]  859   zhangsan    313u      IPv6            0x1111111111111     0t0         TCP        *:cslistener (LISTEN)

## 二、根据进程名称
ps -ef | grep nginx

  501 17780     1   0  8:36下午 ??         0:00.00 nginx: master process nginx
  501 17781 17780   0  8:36下午 ??         0:00.00 nginx: worker process
  501 17790 14611   0  8:39下午 ttys004    0:00.00 grep nginx

然后根据PID杀进程：
sudo kill -9 859
```
