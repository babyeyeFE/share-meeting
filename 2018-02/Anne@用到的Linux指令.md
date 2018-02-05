变更文件权限

chmod 777/755/644 -R  foldername

变更文件拥有者

chown username:username -R foldername

-R 指的是递归处理，文件夹及文件夹下的文件都会被设置

文件相关指令

rm 删除 mv 移动/重命名 cp 复制 mkdir 新建

快速找到某文件位置

find / -name "php.ini" 

-iname 不区分大小写

上传文件，接收文件

Windows  rz    sz

mac  scp

压缩解压文件

zip name.zip foldername

unzip -o name.zip

-o 不询问直接覆盖

http获取资源

wget URL

Linux包管理工具

yum install 

查看PHP进程数

ps aux | grep -c php-fpm

Mac查看端口占用

lsof -i:<port>

