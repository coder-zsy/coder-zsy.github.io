# Nginx

### 1. 安装 Nginx

首先，确保您的服务器上已经安装了 Nginx。如果没有安装，可以使用以下命令进行安装：

对于 CentOS 系统：

```sh
sudo yum install epel-release
sudo yum install nginx
```

对于 Ubuntu/Debian 系统：

```sh
sudo apt update
sudo apt install nginx
```

### 2. 启动和启用 Nginx

安装完成后，启动 Nginx 并设置开机自启：

```sh
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. 放置前端项目的文件

将您的前端项目文件放置到一个合适的目录中。通常，Nginx 的默认网站根目录是 /var/www/html，但您可以选择其他目录。

例如，假设您的前端项目位于 /var/www/myfrontend 目录下：

```sh
sudo mkdir -p /var/www/myfrontend
sudo cp -r /path/to/your/frontend/build/* /var/www/myfrontend/
```

### 4. 配置 Nginx

**查看默认nginx配置**

```sh
sudo find / -name nginx.conf
// /www/server/nginx/conf/nginx.conf
// 默认的配置文件位于 `/etc/nginx/nginx.conf`
```

**查看已配置的站点**

```
// 在nginx.config中查看是否包含以下指令，该指令表示你配置的站点文件，每个文件是一个站点配置
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

**创建新的站点配置文件**

```sh
sudo nano /etc/nginx/sites-available/myfrontend
```

在打开的文件中添加以下内容：

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/myfrontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 可选：日志配置
    access_log /var/log/nginx/myfrontend.access.log;
    error_log /var/log/nginx/myfrontend.error.log;
}
```

- `listen 80;` 表示监听 80 端口。
- `server_name your_domain_or_ip;` 替换为您的域名或服务器 IP 地址。
- `root /var/www/myfrontend;` 指定前端项目的根目录。
- `try_files $uri $uri/ /index.html;` 用于处理单页应用（SPA）的路由问题。

启用配置？
创建符号链接以启用新配置：

```sh
sudo ln -s /etc/nginx/sites-available/myfrontend /etc/nginx/sites-enabled/
```

### 5. 测试配置

在重新加载 Nginx 之前，先测试配置文件是否正确：

```sh
sudo nginx -t
```

如果测试通过，重新加载 Nginx 以应用更改：

```sh
sudo systemctl reload nginx
```

### 6. 访问您的前端项目

现在，您应该能够通过浏览器访问您的前端项目。只需在浏览器地址栏中输入您的域名或服务器 IP 地址即可：

http://your_domain_or_ip

### 7. 其他注意事项

SSL/TLS 配置：如果您需要使用 HTTPS，可以配置 SSL 证书。建议使用 Let's Encrypt 提供的免费证书。
防火墙配置：确保防火墙允许 HTTP (端口 80) 和 HTTPS (端口 443) 请求。
