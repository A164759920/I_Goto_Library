const fs = require("fs");

// 若data.json存在，则实际CookeObj的值将从json文件中读取
const CookeObj = {
  Cookie:
    "FROM_TYPE=weixin; v=5.5; Hm_lvt_7ecd21a13263a714793f376c18038a87=1705640738; wechatSESS_ID=bf2758e90d16ae4c409107563ce19a88843c8d6cb8b9a4b2; Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOjM5MzAwNzMzLCJzY2hJZCI6MTAxLCJleHBpcmVBdCI6MTcwNTk5ODE4NX0.vNyW9Rqzty8kUiX9qQr3Se0WMcjz0FcXO_xAu-9klDz_7HT9rtWwYShERkdrY4TXpjMBEO_54PrxmSTAumj8DIkRvLfo0hT7z1GUe0V959Z-f2AB5Znll1z2FxJIU3ULZq5F-uvyD9X-T7ybpX0L020HTVxUMsEvG2iUygnvZjjrK4xSoZO57Sof_4zPycOI4cN5rcTZv7Aysvg8QzFkG1ANn5w2NMcG3l_2Usry6FFMJEkE54IvzkjGT4mJfK7th4qFEd9sBDJpZDi-C10s4lC-SpJ2jELWPD1F_WB1ZQodDXhT5t_3KkLoouGwpOwOysHQO7lwGHDvp3qiDJ-IiQ; Hm_lpvt_7ecd21a13263a714793f376c18038a87=1705990988; SERVERID=d3936289adfff6c3874a2579058ac651|1705990987|1705990984",
  libId: 125492,
  key: "10,79.",
  seatName: "225",
  keyList: [],
};

// 若data.json存在，则实际libList的值将从json文件中读取
let libList = [
  {
    lib_id: 369,
    lib_floor: "1楼",
    lib_name: "报刊阅览室",
  },
  {
    lib_id: 371,
    lib_floor: "2楼",
    lib_name: "自然科学阅览室A区",
  },
];

// 自动加载本地数据
(function (CookeObj, libList) {
  try {
    const data = fs.readFileSync("./fuckinglib/data.json", "utf8");
    const _data = JSON.parse(data);
    CookeObj = _data.CookeObj;
    _LibList = _data.libList;
    libList.splice(0, libList.length);
    // 遍历liblist
    _LibList.forEach((item) => {
      const libObj = {
        lib_id: item.lib_id,
        lib_floor: item.lib_floor,
        lib_name: item.lib_name,
      };
      libList.push(libObj);
    });
    console.log("✅data.json加载成功");
  } catch (err) {
    console.error("❌data.json暂不存在，关闭服务器时将自动保存");
  }
})(CookeObj, libList);

// 同步保存数据
function saveLibData() {
  const _data = {
    CookeObj,
    libList,
  };
  fs.writeFileSync(
    "./fuckinglib/data.json",
    JSON.stringify(_data),
    "utf8",
    function (err) {
      if (err) {
        console.log("❌保存数据失败：", err);
      } else {
        console.log("✅保存数据成功..");
      }
    }
  );
}

// 异步保存数据，用于异步函数内
function saveLibDataAsync() {
  const _data = {
    CookeObj,
    libList,
  };

  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./fuckinglib/data.json",
      JSON.stringify(_data),
      "utf8",
      (err) => {
        if (err) {
          console.log("❌保存数据失败：", err);
          reject({
            code: 1,
            msg: "save_failed",
          });
        } else {
          console.log("✅保存数据成功..");
          resolve({
            code: 0,
            msg: "save_success",
          });
        }
      }
    );
  });
}

module.exports = {
  CookeObj,
  libList,
  saveLibData,
  saveLibDataAsync,
};
