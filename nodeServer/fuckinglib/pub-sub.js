var Event = (function () {
  var clientList = {},
    $on,
    $emit,
    $remove;
  $on = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };
  $remove = function (key, fn) {
    // fns为引用类型
    var fns = clientList[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      // 若fns存在，且fn不为空，则清除符合条件的fn
      fns && (fns.length = 0);
      // 该方法只是将原数组指向了一个新的空数组，并未实际清空原数组
      // this.clientList[key] = [];
    } else {
      fns.forEach((_fn, index) => {
        if (_fn === fn) {
          fns.splice(index, 1); // 在回调队列中删除该callback
        }
      });
    }
  };
  $emit = function () {
    var key = Array.prototype.shift.call(arguments);
    var fns = clientList[key];
    if (!fns || fns.length === 0) {
      console.log(`${key}事件尚未注册`);
      return false;
    }
    fns.forEach((fn) => {
      fn.apply(this, arguments);
    });
  };
  return {
    $on,
    $emit,
    $remove,
  };
})();
module.exports = {
  Event,
};
