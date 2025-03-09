#!/bin/bash

# 设置默认值
ENV=${1:-production}  # 从命令行参数中获取环境变量，默认为 production
DOCKER_USERNAME=${DOCKER_USERNAME:-yafenghuang}
REPO_NAME=${REPO_NAME:-asp-xms-vite}

# 加载对应的环境变量文件
if [ -f ".env.${ENV}" ]; then
  echo "加载 .env.${ENV} 文件..."
  # shellcheck disable=SC1090
  source ".env.${ENV}"
else
  echo "未找到 .env.${ENV} 文件，使用默认环境变量"
fi

# shellcheck disable=SC2155
export CURRENT_TIME=$(date +"%Y%m%d%H%M%S")
echo "当前时间: ${CURRENT_TIME}"

# 设置镜像名称，拼接环境名称和当前时间
export IMAGE_NAME="${DOCKER_USERNAME}/${REPO_NAME}-${ENV}:${ENV}-${CURRENT_TIME}"
echo "镜像名称: ${IMAGE_NAME}"

# 登录 DockerHub
echo "5820@Feng" | docker login -u yafenghuang2000@gmail.com --password-stdin || {
  echo "DockerHub 登录失败"
  exit 1
}

# 构建镜像
echo "开始构建 ${IMAGE_NAME} 镜像..."
docker-compose build --build-arg NODE_ENV=${ENV} || {
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
docker pull "${IMAGE_NAME}" || {
  echo "镜像未成功推送到 DockerHub"
  exit 1
}

echo "构建并推送 ${IMAGE_NAME} 镜像完成"

./run.sh "${IMAGE_NAME}"
