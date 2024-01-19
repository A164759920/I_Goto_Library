var { UA } = require("./http.js");

const { CookeObj } = require("./myCooke.js");
const { Event } = require("./pub-sub.js");
const WebSocket = require("ws");

const socketDOMAIN = "ws://wechat.v2.traceint.com";

const outTimeMsg = `\u4e0d\u5728\u9884\u7ea6\u65f6\u95f4\u5185,\u8bf7\u5728 20:00-23:59 \u6765\u9884\u7ea6`;
const inTimeMsg = `\u6392\u961f\u6210\u529f\uff01\u8bf7\u57282\u5206\u949f\u5185\u9009\u62e9\u5ea7\u4f4d\uff0c\u5426\u5219\u9700\u8981\u91cd\u65b0\u6392\u961f\u3002`;
// 你已经成功登记了明天的
const successPrefix = `\u4f60\u5df2\u7ecf\u6210\u529f\u767b\u8bb0\u4e86\u660e\u5929\u7684`;
// 获取用户信息失败
const errUserInfo = `\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6b64\u9875\u9762`;

const clientPayload = JSON.stringify({ ns: "prereserve/queue", msg: "" });

function createSocketKey() {
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    }
  );
  return Buffer.from(uuid).toString("base64");
}
//save(1);
function createSocket() {
  let limitSendMsg = null;
  const socket = new WebSocket(`${socketDOMAIN}/ws?ns=prereserve/queue`, {
    headers: {
      "User-Agent": UA,
      "App-Version": "2.0.14",
      Cookie: CookeObj.Cookie,
      Connection: "Upgrade",
      Upgrade: "websocket",
      "Sec-WebSocket-Version": 13,
      "Sec-WebSocket-Key": createSocketKey(),
      "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
    },
  });
  socket.on("open", () => {
    console.log("【webSocket】连接成功");
    // 注册timer 1秒发送一次保活msg
    socket.send(clientPayload);
    limitSendMsg = setInterval(() => {
      socket.send(clientPayload);
    }, 800);
  });
  socket.on("message", (rawData) => {
    const { verifyCookie } = require("./index.js");
    const { ns, msg, code, data } = JSON.parse(rawData.toString());
    console.log("【webSocket】" + msg);

    // TODO:接口code和data拿到可以改

    if (msg === errUserInfo) {
      console.log(`获取用户信息失败code:${code};data:${data}`);
      // TODO:错误重连补丁 待测试
      Event.$emit("resetWs");
    }

    if (msg === 1000) {
      console.log("cookie无效，关闭轮询器");
      Event.$emit("InvalidCookie");
    }
    if (code === 0 && data === 1) {
      console.log("【提示】第一次握手成功");
      verifyCookie().then((value) => {
        console.log("【websocket】模拟刷新SERVERID成功");
        socket.send(clientPayload);
      });
    }
    if (code === 0 && data === 0) {
      const msgPrefix = msg.split(",")[0];
      if (msgPrefix === successPrefix) {
        console.log("【🚀成功】已预约成功..");
        Event.$emit("success");
      }

      if (msg === outTimeMsg) {
        console.log("当前不在排队时间");
      }
      if (msg === inTimeMsg) {
        console.log(`【提示】正在自动排队..`);
      }
    }
  });
  socket.on("close", () => {
    console.log("【提示】已关闭连接");
    clearInterval(limitSendMsg);
  });
  return socket || null;
}

module.exports = {
  createSocket,
};
