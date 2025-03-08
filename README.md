## 本地拉取访问的镜像

./run.sh yafenghuang/asp-xms-vite:test-20250309-001604 测试环境镜像

## 推送到dockerhub

./build.sh test 测试环境打包
./build.sh production 生产环境打包
./build.sh staging 预发布环境打包

## 部署线上服务器

./deploy.sh yafenghuang/asp-xms-vite:test-20250309-001604 测试环境部署
./deploy.sh yafenghuang/asp-xms-vite:production-20250309-001604 生产环境部署
./deploy.sh yafenghuang/asp-xms-vite:staging-20250309-001604 预发布环境部署



# 使用Node.js 20.18.1作为基础镜像
FROM node:20.18.1 as builder

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 根据环境变量构建应用
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm run build:${NODE_ENV} || { echo "Failed to build the application"; exit 1; }

# 使用Nginx作为最终镜像
FROM nginx:mainline-alpine

# 安装必要的工具
RUN apk update && \
  apk add --no-cache git || { echo "Failed to install git"; exit 1; } && \
  # 克隆Brotli模块仓库
  git clone https://github.com/google/ngx_brotli.git /ngx_brotli || { echo "Failed to clone ngx_brotli"; exit 1; } && \
  # 清理临时文件
  rm -rf /var/cache/apk/*

# 修改Nginx配置以启用Brotli模块
RUN sed -i '1i load_module modules/ngx_http_brotli_filter_module.so;' /etc/nginx/nginx.conf || { echo "Failed to modify Nginx configuration for Brotli filter module"; exit 1; } && \
  sed -i '1i load_module modules/ngx_http_brotli_static_module.so;' /etc/nginx/nginx.conf || { echo "Failed to modify Nginx configuration for Brotli static module"; exit 1; }

# 修改Nginx配置以启用Brotli模块
RUN sed -i '1i load_module modules/ngx_http_brotli_filter_module.so;' /etc/nginx/nginx.conf && \
  sed -i '1i load_module modules/ngx_http_brotli_static_module.so;' /etc/nginx/nginx.conf

# 复制Nginx配置文件
COPY ./nginx.conf /etc/nginx/nginx.conf

# 验证Nginx配置文件
RUN nginx -t || { echo "Nginx configuration test failed"; exit 1; }

# # 复制SSL/TLS证书
# COPY ./ssl/certificate.crt /etc/nginx/ssl/certificate.crt
# COPY ./ssl/private.key /etc/nginx/ssl/private.key

# 复制构建好的应用文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
