#!/bin/bash

# 设置环境变量
ENV=${1:-production}
DOCKER_USERNAME=${DOCKER_USERNAME:-yafenghuang}
REPO_NAME=${REPO_NAME:-asp-xms-vite}
IMAGE_NAME="${DOCKER_USERNAME}/${REPO_NAME}:${ENV}"

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

echo "构建并推送 ${IMAGE_NAME} 镜像完成"
