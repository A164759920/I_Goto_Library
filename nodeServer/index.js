// system require
const Path = require("path");
const http = require("http");
const https = require("https");

// node_module require
const Koa = require("koa");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const static = require("koa-static");
const mount = require("koa-mount");

// custom require
const { MOUNT_NAME } = require("./config.default.js");
const { router } = require("./router/index");
const { saveLibData } = require("./fuckinglib/myCooke.js");

const server = new Koa();
server
  .use(mount(MOUNT_NAME, static(Path.join(__dirname, "./static"))))
  .use(cors())
  .use(
    koaBody({
      multipart: true,
      encoding: "utf-8",
      formidable: {
        uploadDir: Path.join(__dirname, "./static"), //上传目录，默认放置在启动目录
        keepExtensions: true, //保存文件后缀
        maxFieldsSize: 10485760, //默认文件大小
      },
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

const IS_HTTPS = process.env.IS_HTTPS || "off";
const NODE_PORT = process.env.NODE_PORT || 8899;

if (IS_HTTPS === "on") {
  const { options } = require("./ssl/index.js");
  https
    .createServer(options, server.callback())
    .listen(NODE_PORT, "0.0.0.0", () => {
      console.log(`🚀HTTPS server is running on: ${NODE_PORT}`);
    });
} else {
  http.createServer(server.callback()).listen(NODE_PORT, "0.0.0.0", () => {
    console.log(`🚀 HTTP server is running on: ${NODE_PORT}`);
  });
}

// 监听终止信号
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => {
    saveLibData();
    process.exit(0);
  });
});
