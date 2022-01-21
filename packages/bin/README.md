# bin #

shell 工具

## server ##

```shell script
# 把当前目录作为静态服务器的根目录
server [-p port]
# 输入localhost[:port]/filepath 即可访问
```

## download-m3u8 ##

下载m3u8及ts文件

```shell
# dir 下载目录
download-m3u8 {m3u8} [-dir {dir}]
```

## split-m3u8 ##

```shell
# filename 不要带.mp4
split-m3u8 {filename} 
```

## combine-m3u8 ##

```shell
combine-m3u8 {filename} {port}
```
