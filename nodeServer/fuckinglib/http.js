const { CookeObj } = require("./myCooke.js");
const axios = require("axios");
const UA =
  "Mozilla/5.0 (Linux; Android 10; TAS-AL00 Build/HUAWEITAS-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 XWEB/5043 MMWEBSDK/20221109 MMWEBID/6856 MicroMessenger/8.0.31.2281(0x28001F59) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64";
function getSERVERID(cookies) {
  let serverid = "";
  cookies[0].split(";").forEach((cookie) => {
    const keyValue = cookie.split("=");
    if (keyValue[0].includes("SERVERID")) {
      //console.log("getSERVERID", cookie);
      serverid = cookie;
    }
  });
  return serverid;
}

function resetSERVERID(newSERVERID) {
  let newCookie = "";
  CookeObj.Cookie.split(";").forEach((cookie) => {
    const keyValue = cookie.split("=");
    if (keyValue[0].includes("SERVERID")) {
      newCookie = newCookie + `;${newSERVERID}`;
      // serverValue = keyValue[1].split("|");
      // serverValue[1] = Math.round(Date.now() / 1000);
      // newCookie =
      //   newCookie +
      //   `;SERVERID=${serverValue[0]}|${serverValue[1]}|${serverValue[2]}`;
    } else {
      newCookie === ""
        ? (newCookie = newCookie + `${cookie}`)
        : (newCookie = newCookie + `;${cookie}`);
    }
  });
  CookeObj.Cookie = newCookie;
  //console.log("resetSERVERID", newCookie);
  return newCookie;
}
const DOMAIN = "https://wechat.v2.traceint.com";
const AxiosRequest = axios.create({
  baseURL: "",
  headers: {
    "App-Version": "2.0.14",
    "User-Agent": UA,
  },
});

AxiosRequest.interceptors.request.use(
  function (config) {
    config.headers["Cookie"] = CookeObj.Cookie;
    // console.log("请求拦截器", config.headers["Cookie"]);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

AxiosRequest.interceptors.response.use(
  function (response) {
    const cookies = response.headers["set-cookie"];
    const serverID = getSERVERID(cookies);
    if (serverID) {
      resetSERVERID(serverID);
    }
    return response;
  },
  function (error) {
    console.log("拦截错误");
    return Promise.reject(error);
  }
);
//save(2);
module.exports = {
  AxiosRequest,
  DOMAIN,
  UA,
};
