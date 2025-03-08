#!/bin/bash

# 设置默认值
DOCKER_USERNAME="yafenghuang"
REPO_NAME="asp-xms-vite"
ENV=${1:-production}  # 从命令行参数中获取环境变量，默认为 production
IMAGE_NAME=${2:-"${DOCKER_USERNAME}/${REPO_NAME}:${ENV}"}  # 从命令行参数中获取镜像名称，默认为 yafenghuang/asp-xms-vite:production
PORT=${PORT:-8000}    # 默认本地端口为 8000
CONTAINER_NAME="asp-xms-vite-${ENV}"  # 容器名称根据环境变量动态设置

# 拉取镜像
echo "开始拉取 ${IMAGE_NAME} 镜像..."
docker pull ${IMAGE_NAME} || {
  echo "镜像拉取失败"
  exit 1
}

# 检查端口是否被占用
while true; do
  if ! lsof -i :${PORT} > /dev/null 2>&1; then
    echo "端口 ${PORT} 可用"
    break
  fi
  echo "端口 ${PORT} 已被占用，尝试端口 $((PORT + 1))"
  PORT=$((PORT + 1))
done

# 运行容器
echo "启动 ${IMAGE_NAME} 容器，使用端口 ${PORT}..."
docker run -d -p ${PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME} || {
  echo "容器启动失败"
  exit 1
}

# 检查容器是否启动成功
echo "检查容器是否启动成功..."
sleep 5  # 等待容器启动
if docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Status}}" | grep -q "Up"; then
  echo "容器已成功启动，访问地址：http://localhost:${PORT}"
else
  echo "容器启动失败，请查看日志："
  docker logs ${CONTAINER_NAME}
  exit 1
fi
