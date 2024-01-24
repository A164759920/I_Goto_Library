# 1.安装 nginx (Ubuntu 版)

```
sudo apt update
sudo apt install nginx
```

# 2.配置 SSL 证书

- 在 **/etc/nginx**下创建 cert 文件夹

```
cd /etc/nginx
mkdir cert
cd cert
```

- 在 **/etc/nginx/cert**下合适位置存放证书

```
示例目录结构:
nginx 文件夹
|-- cert 文件夹
|   |-- server 文件夹
|   |   |-- test.api.baidu.top.key
|   |   `-- test.api.baidu.top_bundle.pem
|   `-- web 文件夹
|       |-- www.baidu.top.key
|       `-- www.baidu.top.pem
```

# 3.配置 nginx

配置文件位置:**/etc/nginx/conf.d/default.conf**
使用给出的示例 **default.conf** 文件替换原文件
替换

- **ssl_certificate** 替换为上一步配置 SSL 证书的 pem 地址
- **ssl_certificate_key** 替换为上一步配置 SSL 证书的 key 地址
- **location** 下 **root** 替换为 vue 中经过 npm run build 后生成的 dist 文件夹的目录
  - 建议与 **vue/package.json** 的 script 中的**push**命令的目录保持一致

# 4.验证 nginx 配置

```
nginx -t

// 若提示权限不够，可先执行
sudo -i
再执行
nginx -t

// 配置成功示例输出
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
