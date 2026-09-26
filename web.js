#!/usr/bin/env node
// DCDeploy 节点 web 服务: 状态页 + 订阅 (/sub) + 健康检查 (/health)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const SUB_FILE = path.join(__dirname, "sub.txt");

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DCDeploy Node</title>
<style>
  body{font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;background:#fff;color:#1f2d3d;margin:0;padding:0}
  .wrap{max-width:720px;margin:60px auto;padding:0 20px}
  h1{font-size:26px;font-weight:600;color:#1e6fff}
  .card{background:#f7faff;border:1px solid #dbe7ff;border-radius:12px;padding:18px 22px;margin:18px 0}
  .card b{display:block;margin-bottom:8px;color:#1e6fff}
  code{background:#eef4ff;border:1px solid #d5e4ff;border-radius:6px;padding:3px 8px;font-size:13px;word-break:break-all}
  .ok{color:#22a06b;font-weight:600}
  .warn{color:#c76a00}
  a{color:#1e6fff;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <h1>DCDeploy 节点已运行</h1>
  <div class="card"><b>节点隧道</b> sing-box + Cloudflare Argo 隧道已启动，节点订阅与隧道地址请查看容器日志（或打开 /sub）。</div>
  <div class="card"><b>订阅地址</b><br/><a href="/sub">/sub</a> (Base64 格式，含 VLESS 节点链接)</div>
  <div class="card"><b>健康检查</b><br/><a href="/health">/health</a></div>
  <p class="warn">提示：临时隧道域名在每次重启后可能变化，固定隧道请设置 ARGO_DOMAIN 与 ARGO_AUTH 环境变量。</p>
</div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  try {
    if (url === "/" || url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } else if (url === "/sub" || url === "/sub.txt") {
      const content = fs.existsSync(SUB_FILE) ? fs.readFileSync(SUB_FILE, "utf-8") : "sub 尚未生成，请稍后在容器日志中查看隧道地址。";
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(content);
    } else if (url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("error: " + e.message);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[web] DCDeploy node web server listening on 0.0.0.0:${PORT}`);
});
