(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global['bz-geetest'] = factory());
}(this, function () { 'use strict';

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var arguments$1 = arguments;

		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments$1[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

	Object.assign = objectAssign;

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

	return index;

}));
