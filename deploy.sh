#!/bin/bash

# 设置默认值
IMAGE_NAME=${1:-"yafenghuang/asp-xms-vite:production"}  # 从命令行参数中获取镜像名称，默认为 yafenghuang/asp-xms-vite:production
REMOTE_PASSWORD="5820@Feng"  # 远程服务器密码
REMOTE_USER="root"  # 远程服务器用户名
REMOTE_HOST="175.178.50.233"  # 腾讯云服务器地址
REMOTE_PORT=22  # 远程服务器 SSH 端口

# 检查是否提供了镜像名称
if [ -z "$IMAGE_NAME" ]; then
  echo "错误：未设置镜像名称 (IMAGE_NAME)"
  exit 1
fi

# 提取镜像名称中的合法部分作为容器名称
CONTAINER_NAME=$(echo "${IMAGE_NAME}" | awk -F'/' '{print $2}' | awk -F':' '{print $1}')

# 推送镜像到远程服务器
echo "推送镜像 ${IMAGE_NAME} 到远程服务器 ${REMOTE_HOST}..."
docker save "${IMAGE_NAME}" | sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" "docker load" || {
  echo "镜像推送失败"
  exit 1
}

# 在远程服务器上启动容器
echo "在远程服务器 ${REMOTE_HOST} 上启动容器..."
sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" << EOF
  # 停止并删除旧容器（如果存在）
  docker stop ${CONTAINER_NAME} || true
  docker rm ${CONTAINER_NAME} || true

  # 启动新容器
  docker run -d \
    --name ${CONTAINER_NAME} \
    --restart always \
    -p 80:80 \
    ${IMAGE_NAME} || {
    echo "容器启动失败"
    exit 1
  }

  echo "容器 ${CONTAINER_NAME} 已成功启动"
EOF
