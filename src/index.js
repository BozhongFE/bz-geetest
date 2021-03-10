import ObjectAssign from 'object-assign';

Object.assign = ObjectAssign;

function getLink(prefix, productPrefix) {
  const { host } = window.location;
  const prodPrefix = productPrefix || prefix;
  if (host.indexOf('office') !== -1) {
    return `${prefix}.office.bzdev.net`;
  }
  if (host.indexOf('online') !== -1) {
    return `${prefix}.online.seedit.cc`;
  }
  return `${prodPrefix}.bozhong.com`;
}
// 兼容低版本浏览器
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

let num = 1;
const api = {
  token: `https://${getLink('bbs')}/restful/misc/token.jsonp`,
  geetest: `https://${getLink('bbs')}/restful/misc/geetest.jsonp`,
};
// 创建一个 jsonp 请求
function jsonp(url, callbackN, callback) {
  num += 1;
  const callbackName = callbackN + num;
  const headEl = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  const scriptUrl = `${url}&__c=${callbackName}`;
  script.src = scriptUrl;
  headEl.appendChild(script);
  window[callbackName] = function success(json) {
    typeof callback === 'function' && callback(json);
    headEl.removeChild(script);
    window[callbackName] = null;
  };
}
// 生成验证码
function getGeetest(token, options) {
  jsonp(`${api.geetest}?token=${token}`, 'restful_misc_geetest_', (data) => {
    if (data.error_code === 0) {
      const initOptions = {
        gt: data.data.gt,
        challenge: data.data.challenge,
        offline: !data.data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
      };
      const geetestOps = Object.assign(initOptions, options.geetestOptions);
      // 使用initGeetest接口
      // 参数1：配置参数
      // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
      initGeetest(geetestOps, (captchaObj) => {
        const body = document.getElementsByTagName('body')[0];
        const geetestBox = document.createElement('div');
        const geetestBoxMain = document.createElement('div');
        const geetestBoxCssText = 'position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);';
        const geetestBoxMainCssText = 'position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);';
        geetestBox.style.cssText = geetestBoxCssText;
        geetestBox.setAttribute('style', geetestBoxCssText);
        geetestBoxMain.style.cssText = geetestBoxMainCssText;
        geetestBoxMain.setAttribute('style', geetestBoxMainCssText);
        geetestBox.setAttribute('class', 'geetest-box');
        geetestBoxMain.setAttribute('class', 'geetest-box__main');
        geetestBox.appendChild(geetestBoxMain);
        body.appendChild(geetestBox);
        captchaObj.appendTo('.geetest-box__main');
        // v0.2.0 统一接受外部方法作为回调
        for (const key in options) {
          if (Object.prototype.toString.call(options[key]) === '[object Function]'
            && Object.prototype.toString.call(captchaObj[key]) === '[object Function]') {
            captchaObj[key](function () {
              options[key](captchaObj);
            });
          }
        }
        captchaObj.onSuccess(() => {
          setTimeout(() => {
            body.removeChild(geetestBox);
          }, 1000);
          options.onSuccess && options.onSuccess(captchaObj);
        });
      });
    } else {
      console.log(data.error_message);
    }
  });
}
// 请求token
function getToken(options) {
  jsonp(`${api.token}?type=${options.tokenType}`, 'restful_misc_token_', (data) => {
    if (data.error_code === 0) {
      getGeetest(data.data.token, options);
    } else {
      console.log(data.error_message);
    }
  });
}
// 抛出方法
function geetest(options) {
  const defaultOptions = {
    tokenType: 'geetest',
    geetestOptions: {
      product: 'embed',
    },
    onSuccess: () => {
      console.log('回调成功！');
    },
  };
  const opts = Object.assign(defaultOptions, options);
  getToken(opts);
}

export default {
  geetest,
};
