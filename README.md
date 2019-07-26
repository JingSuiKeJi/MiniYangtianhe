# wxapp-v1 小程序基本的开发框架
```
wxapp-v1框架是自己在开发了几个小程序之后整理归纳出来的,已经过实际项目的验证,一个基于微信小程序api的种子项目,用于快速构建微信小程序项目,使我们摆脱那些重复劳动,专注于业务代码的编写,减少加班.
基础的js库有:
underscore.js 第三方
q.js 第三方promise库
base.js 自定义 包含微信小程序api接口(不全,用到哪个封装哪个)以及一些常用的方法
config.js app常用配置 包含请求接口路径,页面跳转路径,localStorage的key值等
```

#### 初始化app
```
// 在app的onLaunch方法中引入相关的js,方便在page中获取;
   App({
        onLaunch: function () {
            // 引入相关js
            this.base = require('/libs/base.js');
            this.promise = require('/libs/q.js');
            this.underscore = require('/libs/underscore.js');
            this.config = require('/libs/config.js');
            this.temps = require('/templates/temps.js');
        }
   });
```

#### 初始化page
##### 步骤:
```
// 在base.js中重新封装了初始化对象,page.js这样调用:
    var app = getApp();
    var _g = app.base;
    // initPage中methods里面的方法都会初始化到微信Page中的,
    var initPage = _g.initPage({
        // 页面的初始数据
        data: {},
        // 重新onLoad方法
        onLoad: function (self) {},
        // 重新onShow方法
        onShow: function (self) {},
        // 页面的初始化方法
        methods: {
            test: function () {
                // this 指向微信Page对象
                var self = this;
            }
        },
        // 有引用template时定义
        temps: {}
    });
    Page(initPage);
```
###### 具体说明:
```
base.js 中封装常用的方法,包括
1.初始化页面page对象方法 initPage
2.发送请求方法 ajax 
3.setLS getLS setNavigationBarTitle 等微信api中的方法,或者自定义的一些常用的方法
4.page中有个pm的数据管理器,管理一些不跟页面交互的数据和页面跳转时传递的参数
5.如果需要下拉刷新 需要在页面中定义 getData 方法 挂在page对象上
6.如果需要底部翻页 需要在页面中定义 getPageData 方法 挂在page对象上
```

#### template使用
##### 步骤: 
```
1.在page中引用,采用模板固定格式,data页面传递进来的数据,constant模板对象定义的常量;
2.template模板定义
3.在/templates/temps.js中管理所有的temp对象,新增定义一个模板
4.page.js中需要定义,可以重写方法和常量
```
##### 具体说明: 
```
self 在方法中指向微信Page对象, template中methods里面的方法都会初始化到微信Page中的
// 1.在page中引用,采用模板固定格式,data页面传递进来的数据,constant模板对象定义的常量,
    页面传递参数的定义:
        demoConstant = 模板的key值+Constant, // 在公共初始化方法时就会初始化
        demoData 页面中自定义
   eg:<template is="{{demo}}" data="{{data: demoData,constant:demoConstant}}"/>
// 2.template模板定义,说明:
    3-1. tempTap 与模板定义的methods中对应,
    3-2. data,constant为固定写法,在initPage的时候会初始化constant的值
   eg:  <view>
            <view bindtap="tempTap">
                <text>{{data.userInfo}}</text>
                <text>{{constant.test}}</text>
            </view>
        </view>
// 3.在/templates/temps.js中管理所有的temp对象,新增定义一个模板
// demo模板定义
eg: demo: {
    // 定义常量,常量的key值与wxml中的绑定的名称对于
    data: {
        test: 'test'
    },
    // 定义模板方法
    methods: {
        // 方法key值与wxml中的绑定的名称对于
        tempTap: function () {
            var self = this;
            var _g = getApp().base;
            _g.navigateTo({
                self: self,
                url: 'pages/demo1/demo',
                param: {
                    a: 'demo temp navigate'
                }
            });
        }
    }
}
// 4.page.js中需要定义,可以重写方法和常量
eg: // 有引用template时定义
    temps: {
        demo: {
            // 定义常量,常量的key值与wxml中的绑定的名称对于,data的key与temps.js中data的key值对应
            data: {},
            // 有引用template时,定义重写方法,methods的key值与temps.js中methods的key值对应
            methods: {
                tempTap: function () {
                    // this 指向微信Page对象
                    var self = this;
                    _g.navigateTo({
                        self: self,
                        url: 'pages/demo1/demo',
                        param: {
                            a: 'page demo temp navigate'
                        }
                    });
                }
            }
        }
    }
```