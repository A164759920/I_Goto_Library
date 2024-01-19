const { defineConfig } = require("@vue/cli-service");
const os = require("os");

function getNetworkIp() {
  //获取当前IP地址
  let needHost = ""; // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    console.log("*", e);
    needHost = "127.0.0.1";
  }
  return needHost;
}
module.exports = defineConfig({
  devServer: {
    host: getNetworkIp(),
    port: 8080,
  },
  transpileDependencies: true,
  lintOnSave: false,
});
