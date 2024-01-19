//system require
const fs = require("fs");
const Path = require("path");

const options = {}; // 配置项

(function () {
  const files = fs.readdirSync("./ssl");
  files.forEach((fileName) => {
    if (fileName.includes(".key")) {
      options.key = fs.readFileSync(Path.resolve("./ssl", fileName));
    }
    if (fileName.includes(".pem")) {
      options.cert = fs.readFileSync(Path.resolve("./ssl", fileName));
    }
  });
  if (options.key && options.cert) {
    module.exports = {
      options,
    };
  } else {
    throw Error("ssl证书文件缺失");
  }
})();
