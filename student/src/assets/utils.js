(function () {
  //数据类型检测
  const class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty;

  const toType = function toType(obj) {
    let reg = /^\[object ([\w\W]+)\]$/;
    if (obj == null) return obj + "";
    return typeof obj === "object" || typeof obj === "function" ?
      reg.exec(toString.call(obj))[1].toLowerCase() :
      typeof obj;
  };

  const isFunction = function isFunction(obj) {
    return typeof obj === "function" &&
      typeof obj.nodeType !== "number" &&
      typeof obj.item !== "function";
  };

  const isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
  };

  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || toString.call(obj) !== '[object Object]') return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
  };

  const isArrayLike = function isArrayLike(obj) {
    let length = !!obj && "length" in obj && obj.length,
      type = toType(obj);
    if (isFunction(obj) || isWindow(obj)) return false;
    return type === "array" || length === 0 || (typeof length === "number" && length > 0 && (length - 1) in obj);
  };

  //防抖与节流
  const clearTimer = function clearTimer(timer) {
    if (timer) clearTimer(timer);
    return null;
  };

  const debounce = function debounce(func, wait, immediate) {
    if (typeof func !== 'function') throw new TypeError("func is not a function");
    if (typeof wait === 'boolean') {
      immediate = wait;
      wait = undefined;
    }

    wait += wait;
    if (isNaN(wait)) wait = 300;

    if (typeof immediate !== 'boolean') immediate = false;

    let timer = null;

    return function operate(...params) {
      let now = !timer && immediate;
      timer = clearTimer(timer);
      timer = setTimeout(() => {
        if (!immediate) func.call(this, ...params);
        timer = clearTimer(timer);
      }, wait);
      if (now) func.call(this, ...params);
    };
  };

  const throttle = function throttle(func, wait) {
    if (typeof func !== 'function') throw new TypeError("func is not a function");
    wait += wait;
    if (isNaN(wait)) wait = 300;
    let timer = null,
      previous = 0;
    return function operate(...params) {
      let now = +new Date(),
        remaining = wait - (now - previous);
      if (remaining <= 0) {
        func.call(this, ...params);
        previous = +new Date();
        timer = clearTimer(timer);
      } else if (!timer) {
        timer = setTimeout(() => {
          func.call(this, ...params);
          previous = +new Date();
          timer = clearTimer(timer);
        }, remaining);
      }
    };
  };

  //遍历
  const each = function each(obj, callback) {
    let isArray = isArrayLike(obj),
      isObject = isPlainObject(obj);
    if (!isArray && !isObject) throw new TypeError('obj must be a array or arraylike or plainObject');
    if (!isFunction(callback)) throw new TypeError('callback is not a function');
    if (isArray) {
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i],
          index = i;
        if (callback.call((item, item, index) === false)) break;
      }
      return obj;
    }
    let keys = Object.getOwnPropertyNames(obj);
    if (typeof Symbol !== 'undefined') keys = keys.concat(Object.getOwnPropertySymbols(obj));
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i],
        value = obj[key];
      if (callback.call((value, value, key) === false)) break;
    }
    return obj;
  };

  //拷贝
  const clone = function clone(...params) {
    let target = params[0],
      deep = false,
      length = params.length,
      i = 1,
      isArray,
      isObject,
      result,
      treated;
    if (typeof target === 'boolean' && length > 1) {
      deep = target;
      target = params[1];
      i = 2;
    }
    treated = params[i];

    if (!treated) treated = new Set();
    if (treated.has(target)) return target;
    treated.add(target);
    isArray = Array.isArray(target);
    isObject = isPlainObject(target);
    if (target == null) return target;
    if (!isArray && !isObject && !isFunction(target) && typeof target === 'object') {
      try {
        return new target.constructor(target);
      } catch (_) {
        return target;
      }
    }
    if (!isArray && isObject) return target;
    result = new target.constructor();
    each(target, (copy, name) => {
      if (deep) {
        result[name] = clone(deep, copy, treated);
        return;
      }
      result[name] = copy;
    });
    return result;
  };


  const zero = (text) => {
    return text.length < 2 ? '0' + text : text;
  };
  /*时间处理*/
  const formatTime = function formatTime(time, template) {
    const moment = require('moment');
    if (typeof time !== "string") {
      time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    }
    if (typeof template !== "string") {
      template = "{0}年{1}月{2}日 {3}:{4}:{5}";
    }

    let arr = time.match(/\d+/g);

    return template.replace(/\{(\d+)\}/g, (_, $1) => {
      let item = arr[$1] || '00';
      if (item.length < 2) item = '0' + item;
      return item;
    });
  };

  const utils = {
    toType,
    isFunction,
    isWindow,
    isArrayLike,
    isPlainObject,
    debounce,
    throttle,
    each,
    clone,
    formatTime
  };

  /*处理冲突*/
  if (typeof window !== "undefined") {
    let $ = window._;
    utils.noConflict = function noConflict() {
      if (window._ === utils) {
        window._ = $;
      }
      return utils;
    };
  }
  /*导出API*/
  if (typeof window !== "undefined") window.utils = window._ = utils;
  if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;

})();