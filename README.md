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


# 清除 Docker 构建缓存
docker builder prune

# 清除 Docker 无用的镜像、容器、网络等
docker system prune -a
