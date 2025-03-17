#!/bin/bash

# 设置默认值
IMAGE_NAME=${1:-"${DOCKER_USERNAME}/${REPO_NAME}:production"}
REMOTE_PASSWORD="5820@Feng"  # 远程服务器密码
REMOTE_USER="root"  # 远程服务器用户名
REMOTE_HOST="175.178.50.233"  # 腾讯云服务器地址
REMOTE_PORT=22  # 远程服务器 SSH 端口
MAX_PORT_ATTEMPTS=10  # 最大端口尝试次数
PORT=${PORT:-8001} # 默认本地端口为 8000

# 检查是否提供了镜像名称
if [ -z "$IMAGE_NAME" ]; then
  echo "错误：未设置镜像名称 (IMAGE_NAME)"
  exit 1
fi

# 从镜像名称中提取环境名称
ENV=$(echo "${IMAGE_NAME}" | awk -F':' '{print $2}' | awk -F'-' '{print $1}')
if [ -z "$ENV" ]; then
  echo "错误：无法从镜像名称中提取环境名称"
  exit 1
fi


CONTAINER_NAME="asp-xms-vite-${ENV}"  # 容器名称根据环境名称动态设置

# 检查容器名称是否被占用
if docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
  echo "容器名称 ${CONTAINER_NAME} 已被占用，删除旧容器..."
  docker stop "${CONTAINER_NAME}" > /dev/null 2>&1 || true
  docker rm -f "${CONTAINER_NAME}" > /dev/null 2>&1 || {
    echo "删除旧容器失败"
    exit 1
  }
fi

# 拉取镜像
echo "开始拉取 ${IMAGE_NAME} 镜像..."
docker pull "${IMAGE_NAME}" || {
  echo "镜像拉取失败"
  exit 1
}



# 推送镜像到远程服务器
echo "推送镜像 ${IMAGE_NAME} 到远程服务器 ${REMOTE_HOST}..."
docker save "${IMAGE_NAME}" | sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" "docker load" || {
  echo "镜像推送失败"
  exit 1
}

# 检查端口是否被占用
port_attempts=0
while [ ${port_attempts} -lt ${MAX_PORT_ATTEMPTS} ]; do
  if ! lsof -i :"${PORT}" > /dev/null 999>&1; then
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

# 在远程服务器上启动容器
echo "在远程服务器 ${REMOTE_HOST} 上启动容器..."
sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" << EOF

  # 启动新容器
  docker run -d \
    --name ${CONTAINER_NAME} \
    --restart always \
    -p ${PORT}:80 \
    ${IMAGE_NAME} || {
    echo "容器启动失败"
    exit 1
  }

  echo "容器 ${CONTAINER_NAME} 已成功启动"
EOF

# 检查容器是否启动成功
echo "检查容器是否启动成功..."
sleep 5  # 等待容器启动
if sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" \
  "docker ps --filter 'name=${CONTAINER_NAME}' --format '{{.Status}}' | grep -q 'Up'"; then
  echo "容器已成功启动，访问地址：http://${REMOTE_HOST}:${PORT}"
else
  echo "容器启动失败，请查看日志："
  sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" \
    "docker logs ${CONTAINER_NAME}"
  sshpass -p "${REMOTE_PASSWORD}" ssh -p "${REMOTE_PORT}" "${REMOTE_USER}"@"${REMOTE_HOST}" \
    "docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1 || true"
  exit 1
fi
