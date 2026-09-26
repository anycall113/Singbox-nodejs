# ============================================================
# DCDeploy 节点镜像 - 基于 Singbox-nodejs (Argo 隧道方案)
# 容器内: sing-box(VLESS/WS) + cloudflared(Argo 隧道) 出网
#         轻量 web 服务(web.js) 提供节点状态页与订阅 /sub
# ============================================================
FROM node:alpine3.22

WORKDIR /app

# bash: start.sh 需要; curl/tar/openssl: 下载解压 sing-box/cloudflared
RUN apk add --no-cache bash curl tar openssl coreutils

# 复制 Argo+TUIC 方案核心文件
COPY Argo+TUIC/index.js     /app/index.js
COPY Argo+TUIC/package.json /app/package.json
COPY Argo+TUIC/start.sh     /app/start.sh

# 复制 web 服务与启动脚本
COPY web.js        /app/web.js
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/index.js /app/start.sh /app/entrypoint.sh

# web 服务端口 (DcDeploy 访问/健康检查)
EXPOSE 3000

# 默认环境变量 (面板中可覆盖)
ENV PORT=3000 \
    ARGO_PORT=8001 \
    TUIC_PORT=0

ENTRYPOINT ["/app/entrypoint.sh"]
