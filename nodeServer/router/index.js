const Router = require("koa-router");
const router = new Router();

//Fucking - LIB接口;
const {
  verifyCookieController,
  setCookieController,
  syncgetLibListController,
  asyncgetLibListController,
  changeSeatController,
} = require("../fuckinglib/index.js");

/**
 * @api {POST} /lib/setCookie 设置Cookie
 * @apiGroup 后端
 * @apiDescription
 *  已在接口中对Cookie进行了切分处理，直接将抓包Cookie原封不动传入即可
 *
 * @apiParam {String} newCookie 有效Cookie值
 * @apiParamExample {json} Request-Example:
 * {
 *    "newCookie": "FROM_TYPE=weixin; v=5.5; Hm_lvt_7ecd21a13263a714793f376c18038a87=1693999256; wechatSESS_ID=XXXX; Authorization=XXX; Hm_lpvt_7ecd21a13263a714793f376c18038a87=1694434791; SERVERID=XXXX|1694436422|1694434790"
 * }
 * @apiSuccessExample {json} Response-Example:
 * {
 *    "code": 0,
 *    "msg": "cookie有效"
 * }
 *  @apiErrorExample {json} Error-Response:
 * {
 *    "code": 1,
 *    "msg": "cookie无效"
 * }
 */
router.post("/lib/setCookie", setCookieController);

/**
 * @description 验证Cookie是否有效
 * 该接口一般不对外调用，可在debug时验证Cookie是否有效
 */
router.get("/lib/verifyCookie", verifyCookieController);

/**
 * @api {Get} /lib/getLibList 同步获取场馆列表(无需Cookie)
 * @apiGroup 后端
 * @apiDescription
 *  ❗该接口使用需提前抓包并将数据存入myCooke.js的libList中
 *  @apiSuccessExample {json} Response-Example:
 * {
 *  "code": 0,
    "data": {
      "libId": "374",
      "libName": "三楼社科B区",
      "seatName":"190" 
    }
 * }
 */
router.get("/lib/getLibList", syncgetLibListController);

/**
 * @api {Get} /lib/getLibList2 同步获取场馆列表(需要Cookie)
 * @apiGroup 后端
 * @apiDescription
 *  ❗该接口使用前需调用setCookie接口或手动设置有效Cookie
 * 
 *  【建议用法】:首次使用时先设置一遍Cookie，然后手动调该接口获取LibList，并填入myCooke.js，此后无需再调用该接口
 *  @apiSuccessExample {json} Response-Example:
 * {
 *  "code": 0,
    "data": {
      "libId": "374",
      "libName": "三楼社科B区",
      "seatName":"190" 
    }
 * }
 */
router.get(`/lib/getLibList2`, asyncgetLibListController);

/**
 * @api {POST} /lib/changeSeat 修改座位
 * @apiGroup 后端
 * 
 * @apiParam {String} libId 场馆ID
 * @apiParam {String} seatName 座位名
 * @apiParamExample {json} Request-Example:
 * {
 *      "libId": "374",
 *      "seatName": "190"
 * }
 * @apiSuccessExample {json} Response-Example:
 * {
 *  "code": 0,
    "data": {
      "libId": "374",
      "libName": "三楼社科B区",
      "seatName":"190" 
    }
 * }
 */
router.post("/lib/changeSeat", changeSeatController);

/**
 * @api {Get} /test 测试
 * @apiGroup 后端
 * @apiDescription
 *  用于测试服务器是否部署成功
 *  @apiSuccessExample {json} Response-Example:
 * {
 *  "code": 0,
    "data": "success"
 * }
 */
router.get("/test", (ctx) => {
  ctx.body = {
    code: 0,
    data: "success",
  };
});

module.exports = {
  router,
};
