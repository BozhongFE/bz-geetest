import ObjectAssign from 'object-assign';

Object.assign = ObjectAssign;

function getLink(prefix, productPrefix) {
  var ref = window.location;
  var host = ref.host;
  var prodPrefix = productPrefix || prefix;
  if (host.indexOf('office') !== -1) {
    return ("//" + prefix + ".office.bzdev.net");
  }
  if (host.indexOf('online') !== -1) {
    return ("//" + prefix + ".online.seedit.cc");
  }
  return ("//" + prodPrefix + ".bozhong.com");
}

var num = 1;
var api = {
  token: ("https://" + (getLink('bbs')) + "/restful/misc/token.jsonp"),
  geetest: ("https://" + (getLink('bbs')) + "/restful/misc/geetest.jsonp"),
};
// 创建一个 jsonp 请求
function jsonp(url, callbackN, callback) {
  num += 1;
  var callbackName = callbackN + num;
  var headEl = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  var scriptUrl = url + "&__c=" + callbackName;
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
  jsonp(((api.geetest) + "?token=" + token), 'restful_misc_geetest_', function (data) {
    if (data.error_code === 0) {
      var initOptions = {
        gt: data.data.gt,
        challenge: data.data.challenge,
        offline: !data.data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
      };
      var geetestOps = Object.assign(initOptions, options.geetestOptions);
      // 使用initGeetest接口
      // 参数1：配置参数
      // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
      initGeetest(geetestOps, function (captchaObj) {
        var body = document.getElementsByTagName('body')[0];
        var geetestBox = document.createElement('div');
        var geetestBoxMain = document.createElement('div');
        var geetestBoxCssText = 'position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);';
        var geetestBoxMainCssText = 'position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);';
        geetestBox.style.cssText = geetestBoxCssText;
        geetestBox.setAttribute('style', geetestBoxCssText);
        geetestBoxMain.style.cssText = geetestBoxMainCssText;
        geetestBoxMain.setAttribute('style', geetestBoxMainCssText);
        geetestBox.setAttribute('class', 'geetest-box');
        geetestBoxMain.setAttribute('class', 'geetest-box__main');
        geetestBox.appendChild(geetestBoxMain);
        body.appendChild(geetestBox);
        captchaObj.appendTo('.geetest-box__main');
        captchaObj.onSuccess(function () {
          setTimeout(function () {
            body.removeChild(geetestBox);
          }, 1000);
          options.fn();
        });
      });
    } else {
      console.log(data.error_message);
    }
  });
}
// 请求token
function getToken(options) {
  jsonp(((api.token) + "?type=" + (options.tokenType)), 'restful_misc_token_', function (data) {
    if (data.error_code === 0) {
      getGeetest(data.data.token, options);
    } else {
      console.log(data.error_message);
    }
  });
}
// 抛出方法
function geetest(options) {
  var defaultOptions = {
    tokenType: 'geetest',
    geetestOptions: {
      product: 'embed',
    },
    fn: function () {
      console.log('回调成功！');
    },
  };
  var opts = Object.assign(defaultOptions, options);
  getToken(opts);
}

var index = {
  geetest: geetest,
};

export default index;
