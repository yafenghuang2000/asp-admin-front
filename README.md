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

<!-- 
```
{
    "title": "XMS售后服务管理系统",
    "code": "XMS_AFTER_SALES_SERVICE_PC",
    "path": "/xms-pc",
    "type": "目录",
    "description": "XMS售后服务PC后台管理系统",
    "remark": "这是一个XMS售后服务PC后台管理系统",
    "sortOrder": 0
}
``` -->

<!-- {
    "title": "首页",
    "code": "XMS_HOME",
    "path": "/",
    "type": "目录",
    "remark": "这个是首页报",
    "sortOrder": 1,
    "parentId": "eb792391-02ec-4d44-bf13-94e9e7154a57"
} -->


<!-- {
    "title": "WMS仓储物流APP",
    "code": "WMS WAREHOUSE LOGISTICS APP",
    "path": "/wms",
    "type": "目录",
    "description": "WMS仓库库管APP",
    "remark": "这是一个WMS仓库库管的APP",
    "sortOrder": 0
} -->
