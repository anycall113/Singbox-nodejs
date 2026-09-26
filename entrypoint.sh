#!/bin/bash
# DCDeploy 节点入口: 先启动 web 订阅服务, 再启动主程序(隧道)
cd "$(dirname "$0")"

# 启动 web 服务 (后台)
node web.js &

# 启动主程序: sing-box + cloudflared (start.sh 自带崩溃自动重启)
exec bash start.sh
