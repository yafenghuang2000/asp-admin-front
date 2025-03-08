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
RUN pnpm run build:${NODE_ENV}

# 使用Nginx作为最终镜像
FROM nginx:alpine

# 复制Nginx配置文件
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# # 复制SSL/TLS证书
# COPY ./ssl/certificate.crt /etc/nginx/ssl/certificate.crt
# COPY ./ssl/private.key /etc/nginx/ssl/private.key

# 复制构建好的应用文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
