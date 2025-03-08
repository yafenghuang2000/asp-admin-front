#!/bin/bash

# 设置默认值
DOCKER_USERNAME="yafenghuang"
REPO_NAME="asp-xms-vite"
IMAGE_NAME=${1:-"${DOCKER_USERNAME}/${REPO_NAME}:production"}  # 从命令行参数中获取镜像名称，默认为 yafenghuang/asp-xms-vite:production
PORT=${PORT:-8000}    # 默认本地端口为 8000
MAX_PORT_ATTEMPTS=10  # 最大端口尝试次数

# 从镜像名称中提取环境名称
ENV=$(echo ${IMAGE_NAME} | awk -F':' '{print $2}' | awk -F'-' '{print $1}')
if [ -z "$ENV" ]; then
  echo "错误：无法从镜像名称中提取环境名称"
  exit 1
fi
CONTAINER_NAME="asp-xms-vite-${ENV}"  # 容器名称根据环境名称动态设置

# 检查容器名称是否被占用
if docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
  echo "容器名称 ${CONTAINER_NAME} 已被占用，删除旧容器..."
  docker stop ${CONTAINER_NAME} > /dev/null 2>&1 || true
  docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1 || {
    echo "删除旧容器失败"
    exit 1
  }
fi

# 拉取镜像
echo "开始拉取 ${IMAGE_NAME} 镜像..."
docker pull ${IMAGE_NAME} || {
  echo "镜像拉取失败"
  exit 1
}

# 检查端口是否被占用
port_attempts=0
while [ ${port_attempts} -lt ${MAX_PORT_ATTEMPTS} ]; do
  if ! lsof -i :${PORT} > /dev/null 2>&1; then
    echo "端口 ${PORT} 可用"
    break
  fi
  echo "端口 ${PORT} 已被占用，尝试端口 $((PORT + 1))"
  PORT=$((PORT + 1))
  port_attempts=$((port_attempts + 1))
done

if [ ${port_attempts} -ge ${MAX_PORT_ATTEMPTS} ]; then
  echo "错误：未找到可用端口"
  exit 1
fi

# 运行容器
echo "启动 ${IMAGE_NAME} 容器，使用端口 ${PORT}..."
docker run -d \
  -p ${PORT}:80 \
  --name ${CONTAINER_NAME} \
  ${IMAGE_NAME} || {
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
  docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1 || true
  exit 1
fi
