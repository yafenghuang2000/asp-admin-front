#!/bin/bash

# 设置环境变量
ENV=${1:-production}
DOCKER_USERNAME=${DOCKER_USERNAME:-yafenghuang}
REPO_NAME=${REPO_NAME:-asp-xms-vite}

# 获取当前时间，格式为 YYYYMMDD-HHMMSS
export CURRENT_TIME=$(date +"%Y%m%d-%H%M%S")
echo "当前时间: ${CURRENT_TIME}"

# 设置镜像名称，拼接当前时间
IMAGE_NAME="${DOCKER_USERNAME}/${REPO_NAME}:${ENV}-${CURRENT_TIME}"
echo "镜像名称: ${IMAGE_NAME}"

# 登录 DockerHub
echo "5820@Feng" | docker login -u yafenghuang2000@gmail.com --password-stdin || {
  echo "DockerHub 登录失败"
  exit 1
}

# 构建镜像
echo "开始构建 ${IMAGE_NAME} 镜像..."
docker-compose build --build-arg ENV=${ENV} || {
  echo "镜像构建失败"
  exit 1
}

# 推送镜像
echo "开始推送 ${IMAGE_NAME} 镜像..."
docker-compose push || {
  echo "镜像推送失败"
  exit 1
}

# 验证镜像是否推送到 DockerHub
echo "验证镜像是否推送到 DockerHub..."
docker pull ${IMAGE_NAME} || {
  echo "镜像未成功推送到 DockerHub"
  exit 1
}

echo "构建并推送 ${IMAGE_NAME} 镜像完成"
