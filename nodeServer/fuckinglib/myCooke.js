const CookeObj = {
  Cookie:
    "FROM_TYPE=weixin; v=5.5; Hm_lvt_7ecd21a13263a714793f376c18038a87=1693999256; wechatSESS_ID=5999daf6f0d75bc7251af3336c9f626f76e9ace3899bd7f9; Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOjM5MzAwNzMzLCJzY2hJZCI6MTAxLCJleHBpcmVBdCI6MTY5NDQzODU1MX0.rLVYNPi8M-0iwA_pLYjsV-_jw0WpoSsBCn5x2oMWev9GXmRsF-Vxg1xZFtDUEttsMbaXiI0xYQOTdZqGRoFOkUXl-fr8_MRXiHNYG6l_trg1cTartuMeR_siFm0L509PoEjSZqdzYsJPbtz4F2E7L07ePLzzCO1Lss4E55mrSLHjoovBuH5QXS62D-xiGbZKXv1zER1Xo_Hvpz5Y1ip-f1y61_NZU-hwe9qjq3JU6Eddc4MAjsWSpPSgNpMbZRcyg3UZePQOxXNwc4chx2PtxqmlGofzvyzqx8l3zJP1IR4vLcZMYJ8UCClHBsiXDDAbPx8NVeUyJfRHsZNWQKK-VA; Hm_lpvt_7ecd21a13263a714793f376c18038a87=1694434791; SERVERID=e3fa93b0fb9e2e6d4f53273540d4e924|1694436422|1694434790",
  libId: 125492,
  key: "10,79.",
  seatName: "225",
  keyList: [],
};
// 写一个根据lib_id获取对应lib_Name的函数

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

module.exports = {
  CookeObj,
  libList,
};
