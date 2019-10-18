# bz-geetest

播种网极验验证码模块

## 打包

``` shell
npm run build
```

## 接口

### geetest(tokenType, geetestOptions, callback)

**Arguments**

- `tokenType`（string）token类型

  - 可选，默认`geetest`
  
  ``` js
  - type  string 支持类型
    新用户注册  member_register
      用户登录  member_login
      手机注册获取校验码的验证码 member_register_get_phone_code
      发表信息    forum_post_newthread 发帖，forum_post_reply 回帖
      修改密码    member_resetpwd
      充值卡密    未使用
      斯利安      silian
      忘记密码    member_register_findpwd
      活动        huodong
      疯狂造人    crazy
      geetest验证码类 geetest
      --没有相关的参数 请联系接口的开发者
  ```

- `geetestOptions` （Object）极验内部参数

  - product：默认`embed` ，这是是以前的参数，支持

  | 参数    | 类型   | 说明                           | 默认值      | 可选值                                                       |
  | :------ | :----- | :----------------------------- | :---------- | :----------------------------------------------------------- |
  | product | 字符串 | 设置下一步验证的展现形式       | popup       | float、popup、custom、bind                                   |
  | width   | 字符串 | 设置按钮的长度                 | 300px       | 单位可以是 px，%，em，rem，pt                                |
  | lang    | 字符串 | 设置验证界面文字的语言         | zh-cn       | zh-cn、zh-hk、zh-tw、en、ja、ko、id、ru、ar、es、pt-pt、fr、de |
  | https   | 布尔   | 是否使用 https 请求            | false       | true。不进行设置，默认取当前页面协议，本地文件直接打开测试与hybrid开发使用请设置true |
  | timeout | 数字   | 设置验证过程中单个请求超时时间 | 30000（ms） | 大于0的整数                                                  |

  > 更多接口参考：https://docs.geetest.com/install/apirefer/api/web

- `fn` （Function）验证成功回调

## Example

script 标签引用极验

``` js
<script src="https://static.geetest.com/static/tools/gt.js"></script>
```

### module模式

``` js
<script src="./bz-geetest/0.1.0/bz-geetest.js"></script>
<script>
  window['bz-geetest'].geetest({
    tokenType: 'geetest',
    geetestOptions: {
      product: 'embed'
    },
    fn: function() {
      console.log('成功');
    }
  });
</script>
```

### seaJS模式

``` js
<script>
	seajs.use(['./bz-geetest/0.1.0/bz-geetest.js'], function() {
  window['bz-geetest'].geetest({
    tokenType: 'geetest',
    geetestOptions: {
      product: 'embed'
    },
    fn: function() {
      console.log('成功');
    }
  });
});  
</script>
```

### requireJS

``` js
<script>
  require(['./bz-geetest/0.1.0/bz-geetest'], function(geetest) {
    geetest.geetest({
      tokenType: 'geetest',
      geetestOptions: {
        product: 'embed'
      },
      fn: function() {
        console.log('成功');
      }                                   
    });
  });
</script>
```

## demo

[index](./index.html)