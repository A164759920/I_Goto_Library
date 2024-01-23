const { CookeObj, libList } = require("./myCooke.js");
let { AxiosRequest, DOMAIN } = require("./http.js");
// const { throttleSendMail } = require("../service/email.service.js");
const { createSocket } = require("./websocket.js");
const { Event } = require("./pub-sub.js");
const { Cron } = require("croner");
//const cron = require("node-cron");

var reserveInterval = null;
var currentSocket = null;
var refreshCount = 0;
var availableSeatStack = [];
/**
 * @deprecated 内存泄露弃用
 */
// 0点定时清空
// const cleanTask = cron.schedule(
//   "0 0 * * *",
//   () => {
//     currentSocket = null;
//     reserveInterval = null;
//   }
//   // {
//   //   timezone: "Asia/Shanghai",
//   // }
// );

// 0点定时清空
const cleanTask = Cron(
  "0 0 * * *",
  {
    timezone: "Asia/Shanghai",
  },
  () => {
    currentSocket = null;
    reserveInterval = null;
  }
);

/**
 * @deprecated 内存泄露弃用
 */
// // 发送提醒
// const noticeTsk = cron.schedule(
//   "45 19 * * *",
//   () => {
//     console.log("发送了提醒");
//     throttleSendMail("lib_notice");
//   }
//   // {
//   //   timezone: "Asia/Shanghai",
//   // }
// );

// 发送提醒
const noticeTsk = Cron(
  "45 19 * * *",
  {
    timezone: "Asia/Shanghai",
  },
  () => {
    console.log("发送了提醒");
    //throttleSendMail("lib_notice");
  }
);

/**
 * @deprecated 内存泄露弃用
 */
// // 循环预约请求
// const successTask = cron.schedule(
//   "20 19 20 * * *",
//   () => {
//     // 注册预约轮询器
//     reserveInterval = setInterval(() => {
//       reserveSeat();
//     }, 900);
//   }
//   // {
//   //   timezone: "Asia/Shanghai",
//   // }
// );

// 循环预约请求
const successTcatask = Cron(
  "55 59 19 * * *",
  {
    timezone: "Asia/Shanghai",
  },
  () => {
    // 注册预约轮询器
    reserveInterval = setInterval(() => {
      reserveSeat();
    }, 900);
  }
);
/**
 * @deprecated 内存泄露弃用
 */
// // 无论成功与否，都将在轮询器执行一分半后kill
// const killTask = cron.schedule(
//   "30 1 20 * * *",
//   () => {
//     currentSocket.close();
//     currentSocket = null;
//     clearInterval(reserveInterval);
//     reserveInterval = null;
//     refreshCount = 0;
//   }
//   // {
//   //   timezone: "Asia/Shanghai",
//   // }
// );

// 无论成功与否，都将在轮询器执行一分半后kill
const killTask = Cron(
  "30 2 20 * * *",
  {
    timezone: "Asia/Shanghai",
  },
  () => {
    currentSocket ? currentSocket.close() : (currentSocket = null);
    clearInterval(reserveInterval);
    reserveInterval = null;
    refreshCount = 0;
  }
);

/**
 * @deprecated 内存泄露弃用
 */
// cleanTask.start();
// successTask.start();
// noticeTsk.start();
// killTask.start();

// 注册success监听事件
Event.$on(
  "success",
  (fn = () => {
    // kill socket
    currentSocket?.close();
    currentSocket = null;
    // kill 轮询器
    clearInterval(reserveInterval);
    reserveInterval = null;
    // Event.$remove("success");
    refreshCount = 0;
    // throttleSendMail("lib_success");
    // 清除栈
    availableSeatStack = null;
  })
);

/**
 * @description ws获取用户信息失败重连
 */
Event.$on(
  "resetWs",
  (fn = () => {
    currentSocket?.close();
    currentSocket = null;
  })
);

/**
 * @description 无效cookie关闭连接
 */
Event.$on(
  "InvalidCookie",
  (fn = () => {
    currentSocket?.close();
    currentSocket = null;
    // kill 轮询器
    clearInterval(reserveInterval);
    reserveInterval = null;
    // 发送失败提醒
    throttleSendMail("lib_fail");
    refreshCount = 0;
  })
);

// 反防刷 v1.0
async function refreshPage() {
  const task1 = AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
    operationName: "prereserve",
    query:
      "query prereserve {\n userAuth {\n prereserve {\n prereserve {\n day\n lib_id\n seat_key\n seat_name\n is_used\n user_mobile\n id\n lib_name\n }\n }\n }\n}",
  });
  const task2 = AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
    operationName: "index",
    query:
      'query index {\n userAuth {\n user {\n prereserveAuto: getSchConfig(extra: true, fields: "prereserve.auto")\n }\n currentUser {\n sch {\n isShowCommon\n }\n }\n prereserve {\n libs {\n is_open\n lib_floor\n lib_group_id\n lib_id\n lib_name\n num\n seats_total\n }\n }\n oftenseat {\n prereserveList {\n id\n info\n lib_id\n seat_key\n status\n }\n }\n }\n}',
  });
  try {
    const res = await Promise.all([task1, task2]);
    if (res) {
      return Promise.resolve(res);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * @description 预约座位
 */
async function reserveSeat() {
  // 先排队，再抢座
  if (!currentSocket) {
    console.log("创建了socket-client");
    currentSocket = createSocket();
    // 将需要抢的座位list压入栈
    //  availableSeatStack = CookeObj.keyList;
  }
  if (refreshCount % 2 === 0) {
    try {
      const res = await refreshPage();
      if (res) {
        console.log("【😆提示】反防刷触发");
        try {
          const res = await AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
            operationName: "save",
            query:
              "mutation save($key: String!, $libid: Int!, $captchaCode: String, $captcha: String) {\n userAuth {\n prereserve {\n save(key: $key, libId: $libid, captcha: $captcha, captchaCode: $captchaCode)\n }\n }\n}",
            variables: {
              key: `${CookeObj.key}.`,
              // 将这里改为取availableSeatStack的首元素
              // key: `${availableSeatStack[0]}.`,
              libid: Number(CookeObj.libId),
              captchaCode: "",
              captcha: "",
            },
          });
          const { data, errors } = res.data;
          const { userAuth } = data;
          console.log("【reserveSeat】", userAuth);
          if (errors) {
            console.log("【错误】", errors[0].msg);
            //availableSeatStack.shift();
          } else {
            if (userAuth) {
              console.log("【提示】预约请求提交成功..");
            } else {
              console.log("其余情况");
            }
          }
        } catch (error) {
          console.log("[1005]【reserveSeat】意外错误");
        }
      }
    } catch (error) {
      console.log("刷新页面失败", error);
    }
  }
  refreshCount++;
}

async function verifyCookie() {
  try {
    const res = await AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
      operationName: "libLayout",
      query:
        "query libLayout($libId: Int, $libType: Int) {\n userAuth {\n reserve {\n libs(libType: $libType, libId: $libId) {\n lib_id\n is_open\n lib_floor\n lib_name\n lib_type\n lib_layout {\n seats_total\n seats_booking\n seats_used\n max_x\n max_y\n seats {\n x\n y\n key\n type\n name\n seat_status\n status\n }\n }\n }\n }\n }\n}",
      variables: { libId: CookeObj.libId },
    });
    const { data } = res.data;
    const { userAuth } = data;
    if (userAuth) {
      return {
        code: 0,
        msg: "cookie有效",
      };
    } else {
      return {
        code: 1,
        msg: "cookie无效",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      code: 1,
      msg: error,
    };
  }
}

async function setCookieController(ctx) {
  const { newCookie } = ctx.request.body;
  if (newCookie) {
    CookeObj.Cookie = newCookie;
    try {
      const res = await verifyCookie();
      ctx.body = res;
    } catch (error) {
      ctx.body = {
        code: 1,
        msg: "[1001-verifyCookie]-failed",
      };
    }
  } else {
    ctx.body = {
      code: 2,
      msg: "[1002-newCookie]Cookie为空",
    };
  }
}
async function verifyCookieController(ctx) {
  try {
    const res = await verifyCookie();
    ctx.body = res;
  } catch (error) {
    ctx.body = {
      code: 1,
      msg: "[1003-verifyCookie]-failed",
    };
  }
}

/**
 * @description 根据座位名获取坐标key
 * @param {Array} seatList 座位表
 * @param {Number} seatName 座位名
 * @returns
 */
function getkeyByName(seatList, seatName) {
  for (const seat of seatList) {
    if (seat.name === seatName) {
      return seat.key;
    }
  }
  return null;
}
/**
 * @description 修改预约的座位
 * @param {Number} libId
 * @param {Number} seatName
 */
async function changeSeatByLibIdandSeatNumber(libId, seatName) {
  try {
    const res = await AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
      operationName: "libLayout",
      query:
        "query libLayout($libId: Int, $libType: Int) {\n userAuth {\n reserve {\n libs(libType: $libType, libId: $libId) {\n lib_id\n is_open\n lib_floor\n lib_name\n lib_type\n lib_layout {\n seats_total\n seats_booking\n seats_used\n max_x\n max_y\n seats {\n x\n y\n key\n type\n name\n seat_status\n status\n }\n }\n }\n }\n }\n}",
      variables: {
        libId,
      },
    });
    // TODO :cookie无效时需要做前置拦截处理
    if (res.data.data.userAuth.reserve) {
      const seatList = res.data.data.userAuth.reserve.libs[0].lib_layout.seats;
      const seatKey = getkeyByName(seatList, seatName.toString());
      // 修改预约的座位
      CookeObj.libId = libId;
      CookeObj.key = seatKey;
      CookeObj.seatName = seatName;
      // console.log(
      //   "修改",
      //   `${CookeObj.key}`,
      //   typeof CookeObj.key,
      //   CookeObj.libId,
      //   typeof CookeObj.libId
      // );
      return {
        code: 0,
        data: {
          libId,
          seatName,
          seatKey,
        },
      };
    } else {
      return {
        code: 1,
        data: "[1006]查询座位Key失败",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      code: 2,
      data: `[1007]暂无该区域:${libId}`,
      error,
    };
  }
}

function getLibNamebyLibId(libId) {
  for (let i = 0; i < libList.length; i++) {
    if (libList[i].lib_id == libId) {
      return libList[i].lib_name;
    }
  }
}

async function getLibList() {
  try {
    const res = await AxiosRequest.post(`${DOMAIN}/index.php/graphql/`, {
      operationName: "list",
      query:
        "query list {\n userAuth {\n reserve {\n libs(libType: -1) {\n lib_id\n lib_floor\n is_open\n lib_name\n lib_type\n lib_group_id\n lib_comment\n lib_rt {\n seats_total\n seats_used\n seats_booking\n seats_has\n reserve_ttl\n open_time\n open_time_str\n close_time\n close_time_str\n advance_booking\n }\n }\n libGroups {\n id\n group_name\n }\n reserve {\n isRecordUser\n }\n }\n record {\n libs {\n lib_id\n lib_floor\n is_open\n lib_name\n lib_type\n lib_group_id\n lib_comment\n lib_color_name\n lib_rt {\n seats_total\n seats_used\n seats_booking\n seats_has\n reserve_ttl\n open_time\n open_time_str\n close_time\n close_time_str\n advance_booking\n }\n }\n }\n rule {\n signRule\n }\n }\n}",
    });
    const LibList = res.data.data.userAuth.reserve.libs;
    // 遍历liblist
    CookeObj.libList = [];

    LibList.forEach((item) => {
      const libObj = {
        lib_id: item.lib_id,
        lib_floor: item.lib_floor,
        lib_name: item.lib_name,
      };
      CookeObj.libList.push(libObj);
    });
    console.log("查询结果", CookeObj.libList);
    return {
      code: 0,
      data: {
        libId: CookeObj.libId,
        libList,
        libName: getLibNamebyLibId(CookeObj.libId),
        seatName: CookeObj.seatName,
      },
    };
  } catch (error) {
    return {
      code: 1,
      data: "[1008]获取区域列表错误",
    };
  }
}

/**
 * @description 异步获取场馆列表接口(需要cookie)
 */
async function asyncgetLibListController(ctx) {
  try {
    const res = await getLibList();
    if (res) {
      ctx.body = res;
    }
  } catch (error) {
    ctx.body = {
      code: 2,
      data: "[1009]获取区域列表错误",
    };
  }
}

/**
 * @description 同步获取场馆列表接口(无需cookie)
 * @return {Object} 返回所有可选场馆列表
 */
function syncgetLibListController(ctx) {
  ctx.body = {
    code: 0,
    data: {
      libId: CookeObj.libId,
      libList,
      libName: getLibNamebyLibId(CookeObj.libId),
      seatName: CookeObj.seatName,
    },
  };
}

async function changeSeatController(ctx) {
  const { libId, seatName } = ctx.request.body;
  if (libId && seatName) {
    const res = await changeSeatByLibIdandSeatNumber(libId, seatName);
    ctx.body = res;
  } else {
    ctx.body = {
      code: 1,
      data: "[1010]参数错误",
    };
  }
}

module.exports = {
  verifyCookie,
  setCookieController,
  verifyCookieController,
  asyncgetLibListController,
  syncgetLibListController,
  changeSeatController,
};
