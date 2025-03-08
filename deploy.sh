#!/bin/bash

# 设置默认值
IMAGE_NAME=${1:-"yafenghuang/asp-xms-vite:production"}  # 从命令行参数中获取镜像名称，默认为 yafenghuang/asp-xms-vite:production
REMOTE_USER=${REMOTE_USER:-root}  # 远程服务器用户名
REMOTE_HOST=${REMOTE_HOST:-your.alibaba.cloud.server}  # 阿里云服务器地址
REMOTE_PORT=${REMOTE_PORT:-22}  # 远程服务器 SSH 端口

# 检查是否提供了远程服务器地址
if [ -z "$REMOTE_HOST" ]; then
  echo "错误：未设置远程服务器地址 (REMOTE_HOST)"
  exit 1
fi

# 从镜像名称中提取环境名称
ENV=$(echo ${IMAGE_NAME} | awk -F':' '{print $2}' | awk -F'-' '{print $1}')
if [ -z "$ENV" ]; then
  echo "错误：无法从镜像名称中提取环境名称"
  exit 1
fi

CONTAINER_NAME="asp-xms-vite-${ENV}"  # 容器名称根据环境名称动态设置

# 检查是否提供了镜像名称
if [ -z "$IMAGE_NAME" ]; then
  echo "错误：未设置镜像名称 (IMAGE_NAME)"
  exit 1
fi


# 将镜像重新标记为 CONTAINER_NAME
echo "将镜像 ${IMAGE_NAME} 重新标记为 ${CONTAINER_NAME}..."
docker tag ${IMAGE_NAME} ${CONTAINER_NAME} || {
  echo "镜像重新标记失败"
  exit 1
}

# 推送镜像到远程服务器
echo "推送镜像 ${CONTAINER_NAME} 到远程服务器 ${REMOTE_HOST}..."
docker save ${CONTAINER_NAME} | ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} "docker load" || {
  echo "镜像推送失败"
  exit 1
}

# 在远程服务器上启动容器
echo "在远程服务器 ${REMOTE_HOST} 上启动容器..."
ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << EOF
  # 停止并删除旧容器（如果存在）
  docker stop ${CONTAINER_NAME} || true
  docker rm ${CONTAINER_NAME} || true

  # 启动新容器
  docker run -d \
    --name ${CONTAINER_NAME} \
    --restart always \
    -p 80:80 \
    ${CONTAINER_NAME} || {
    echo "容器启动失败"
    exit 1
  }

  echo "容器 ${CONTAINER_NAME} 已成功启动"
EOF

# 输出访问地址
echo "部署完成，访问地址：http://${REMOTE_HOST}"
