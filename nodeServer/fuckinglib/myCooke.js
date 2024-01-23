const fs = require("fs");

const CookeObj = {
  Cookie:
    "FROM_TYPE=weixin; v=5.5; wechatSESS_ID=92813014a4cfa33bbec379f42bd40633c923d26e4fa479a1; Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOjM5MzAwNzMzLCJzY2hJZCI6MTAxLCJleHBpcmVBdCI6MTcwNTY0NzkzNn0.DUz6cNlGZ1wTIRtG2kK4W0H3R1R3j1pPBzq2Rv2PYEHmpzmciaA17MG8sD9uhPY60H0U6fHOFNfqyOuXst8vKCNni93-YB6Ea9ApMQlqCBSV0MEennXKfPPxQqT3NhPMuE_nT2rAMJ6Vvin59sRuIkzpBgLY-CFv9vTyZCmMt1t26oPN9JbsD7OWQH6ddsjY_GAGcTvwBdqt35mybYtEk5bIbfUH23RqmlKykwEcg3DX2cUfm35--v0b1tUIc2wiZlA2ho63N5PrtlnjHXb53Ig58CYRfgHeXDn0CF9kMPc4PkchEjg2iFIYeVHzbBIzxmdSQZVHSqs4yRO1mnD0Sg; Hm_lvt_7ecd21a13263a714793f376c18038a87=1705640738; Hm_lpvt_7ecd21a13263a714793f376c18038a87=1705640738; SERVERID=82967fec9605fac9a28c437e2a3ef1a4|1705640742|1705640731",
  libId: 125492,
  key: "10,79.",
  seatName: "225",
  keyList: [],
};
  
const libList = [
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
  {
    lib_id: 372,
    lib_floor: "2楼",
    lib_name: "自然科学阅览室B区",
  },
  {
    lib_id: 125492,
    lib_floor: "3楼",
    lib_name: "社科阅览室A区",
  },
  {
    lib_id: 374,
    lib_floor: "3楼",
    lib_name: "社科阅览室B区",
  },
  {
    lib_id: 125681,
    lib_floor: "2楼",
    lib_name: "电子阅览室",
  },
];

// 自动加载本地数据
(function (CookeObj, libList) {
  try {
    const data = fs.readFileSync("./fuckinglib/data.json", "utf8");
    const _data = JSON.parse(data);
    CookeObj = _data.CookeObj;
    libList = _data.libList;
    console.log("✅data.json加载成功");
  } catch (err) {
    console.error("❌data.json不存在", err.message);
  }
})(CookeObj, libList);

// 保存数据
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
        process.exit(0);
      } else {
        console.log("✅保存数据成功..");
        process.exit(0);
      }
    }
  );
}

module.exports = {
  CookeObj,
  libList,
  saveLibData,
};
