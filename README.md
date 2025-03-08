'unit-whitelist': ['em', 'rem', '%', 's'],

## 本地拉取访问的镜像

./run.sh yafenghuang/asp-xms-vite:test-20250309-001604 测试环境镜像

## 部署打包

./build.sh test 测试环境打包
./build.sh production 生产环境打包
./build.sh staging 预发布环境打包

## 部署

./deploy.sh test 测试环境部署
./deploy.sh production 生产环境部署
./deploy.sh staging 预发布环境部署
