/**
 * Created by hou on 19/05/2017.
 */
function base() { };

var _ = require('./underscore.js');
var _c = require('./config.js');
var _md5 = require('./md5.js');
var _t = require('../templates/temps.js');
var _q = require('./q.js');
var event = require('./event.js');

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * formatTime(new Date(),'yyyy-MM-dd hh:mm:ss.S'); ==> 2006-07-02 08:09:04.423
 * formatTime(new Date(),'yyyy-M-d h:m:s.S'); ==> 2006-7-2 8:9:4.18
 * @param {[type]} fmt [description]
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

base.prototype = {

    /**
     * 数据管理器 dm = data manager
     */
    dm: {
        isRefuseAuthorization: false, // 是否拒绝授权获取用户信息,默认false
        sessionKey: '', // 登录后token
        canLoadMore: 1, // 全局可以请求ajax
        preUrl: '', // 页面调用用方法跳转时,前一个页面是什么,防止点击多次
        param: {}, // 页面调用方法跳转时,所带的参数是什么
        userInfo: '', // 用户信息
        userInfoRes: '', // 微信返回的登录信息,包括加密后的信息encryptedData,iv等信息
        wxLoginCode: '', //  微信登录的login code(登录凭证),使用code 换取 session_key api，将 code 换成 openid 和 session_key

    },
    getUserInfo: function () {
        let _g = this;
        return _g.getLS(_c.LSKeys.userInfo);
    },
    getDBUserInfo: function (User, page, showToast) {
        let _g = this;
        let sessionKey = _g.getSessionKey();
        if (sessionKey) {
            User.get(page, {
                showToast: showToast
            }).then(function (resp) {
                _g.setLS(_c.LSKeys.userInfo, resp.data, _c.sessionKeyExpireTime);
            }, function (error) {
                _g.logger(error);
            });
        }
    },

    getSessionKey: function () {
        let _g = this;
        return _g.getLS(_c.LSKeys.sessionKey);
    },

    /**
     * 初始化页面对象
     * @param options
     * @returns {{data: {}, pm: {param: {}, data: {}}, onLoad: onLoad, onReady: onReady, onShow: onShow, onHide: onHide, onUnload: onUnload, onShareAppMessage: onShareAppMessage, onPullDownRefresh: onPullDownRefresh, onReachBottom: onReachBottom, back: back, home: home}}
     */
    initPage: function (options) {
        var _g = this;
        var onLoad = options.onLoad; // 重写onLoad
        var onShow = options.onShow; // 重写onShow
        var onHide = options.onHide; // 重写onHide
        var onReady = options.onReady; // 重写onReady
        var onUnload = options.onUnload; // 重写onUnload
        var onPageScroll = options.onPageScroll;
        var methods = options.methods || {}; // 页面中的方法
        var temps = options.temps || {}; // 页面中的模板
        const headerHeight = _g.getHeaderHeight().headerHeight;
        const statusBarHeight = _g.getStatusBarHeight();
        options.data.statusBarHeight = statusBarHeight;
        options.data.headerHeight = Number(headerHeight) + Number(statusBarHeight);
        options.data.host = _g.getHost();
        options.data.currentTime = 0;
        //长按/双击/单击的判断
        options.data.touchStartTime = 0;
        options.data.touchEndTime = 0;
        options.data.lastTapTime = 0;
        // 单击事件点击后要触发的函数
        options.data.lastTapTimeoutFunc = null;
        //location 授权弹窗控制
        options.data.hiddenLocationPopup = true;
        options.data.myLocation = {
            lon: 112.59000,
            lat: 28.12000
        };

        var page = {
            data: options.data || {},
            onLoad: function (options) {
                var self = this;
                wx.hideShareMenu();
                wx.hideTabBar();
                if (self.route !== _c.pages.home.index) {
                    self.setData({
                        host: _g.getHost()
                    });
                }
                const scene = decodeURIComponent(options.scene);
                if (scene != 'undefined') {
                    console.log(scene);
                    const sceneData = _g.getDataByUrl(scene);
                    console.log(sceneData);
                    if (sceneData.p) {
                        sceneData.promoCode = sceneData.p;
                    }
                    if (sceneData.promoCode) {
                        _g.setLS(_c.LSKeys.promoCode, sceneData.promoCode, _c.promoCodeExpireTime)
                    }
                    if (sceneData.t) {
                        self.setData({
                            thirdId: sceneData.t
                        });
                    }
                    if (sceneData.id) {
                        self.setData({
                            id: sceneData.id
                        });
                    }
                    if (sceneData.c) {
                        self.setData({
                            userCutId: sceneData.c
                        });
                    }
                    if (sceneData.s) {
                        self.setData({
                            storeId: sceneData.s
                        });
                    }
                }
                // 原始方式/分享页面传递单数兼容
                if (_g.j2s(options) != '{}') {
                    _.each(options, function (val, key) {
                        self.data[key] = val;
                    });
                    if (options.promoCode) {
                        _g.setLS(_c.LSKeys.promoCode, options.promoCode, _c.promoCodeExpireTime)
                    }
                }
                // param 页面自定方法传递的参数
                if (_g.j2s(_g.dm.param) != '{}') {
                    _.each(_g.dm.param, function (val, key) {
                        self.data[key] = val;
                    });
                }

                // 来源是邀请
                if (self.data.promoCode) {
                    _g.setLS(_c.LSKeys.promoCode, self.data.promoCode, _c.promoCodeExpireTime);
                }
                // if (self.data.recallUserId) {
                //     _g.setLS(_c.LSKeys.recallUserId, self.data.recallUserId, _c.promoCodeExpireTime);
                // }
                if (self.route == 'pages/goods/bargain') {
                    if (!_.isUndefined(options.userCutId)) {
                        self.setData({
                            userCutId: options.userCutId,
                            goodsId: options.goodsId
                        });
                    }
                }
                //解决从商品详情页退出再通过分享链接进去其他商品，结果没有切换的问题
                if (self.route == 'pages/goods/detail') {
                    if (!_.isUndefined(options.id)) {
                        self.setData({
                            id: options.id
                        });
                    }
                }
                self.data.prePageUrl = _g.dm.prePageUrl || ''; // 前一个页面的url路径
                self.data.openTimes = 0; // 页面打开次数 默认0
                self.data.page = _c.defaultPage; // 页码 默认1
                self.data.pageSize = _c.defaultPageSize; // 每页数 默认20

                // 重置模板data
                var tempsData = {};
                _.each(temps, function (tempVal, tempKey) {
                    var tempData = tempVal.data;
                    var tempOriginObj = _g.clone(_t[tempKey]);
                    if (tempData && _g.j2s(tempData) != '{}') {
                        _.each(tempData, function (tempDataVal, tempDataKey) {
                            tempOriginObj.data[tempDataKey] = tempDataVal;
                        });
                    }
                    tempsData[tempKey + 'Constant'] = tempOriginObj.data;
                });
                // if (!_g.getLS(_c.LSKeys.shareQRCode)) {
                // console.log(222222)
                // _g.getShareCode(self);
                // }
                self.setData(tempsData);
                const User = require('../service/User');

                if (self.route != 'pages/home/index' &&
                    self.route != 'pages/home/login' &&
                    _g.getLS(_c.LSKeys.promoCode) &&
                    _g.checkLogin({type: 1})) {
                    _g.userLinkUser(self);
                }

                // 执行页面自定义的 onLoad 方法
                onLoad && onLoad(self);
                if (['pages/home/login',
                    // 'pages/home/index',
                    // 'pages/goods/detail',
                    // 'pages/goods/myBargain',
                    // 'pages/store/cart',
                    // 'pages/me/index'
                    ].indexOf(self.route) > -1) {
                    if (!_g.checkLogin({ type: 1 })) {
                        self.getMyLocation();
                    }
                }
            },
            onReady: function () {
                // 执行页面自定义的 onReady 方法
                const self = this;
                if (['pages/home/login',
                    // 'pages/home/index',
                    // 'pages/goods/detail',
                    // 'pages/goods/myBargain',
                    // 'pages/store/cart',
                    // 'pages/me/index'
                    ].indexOf(self.route) > -1) {
                    
                    self.location = self.selectComponent('#location');
                    if (self.location) {
                        self.location.onCancelTap = function() {
                            self.setData({
                                hiddenLocationPopup: true
                            });
                        }
                        event.on('location-getSettingData', self, function(e) {
                            self.setData({
                                hiddenLocationPopup: true
                            });
                            if (e.detail.authSetting['scope.userLocation']) {
                                //开启成功
                                self.getMyLocation && self.getMyLocation();
                            } else {
                                //开启失败
                            }
                        });
                    }
                }
                onReady && onReady(this);
            },
            onShow: function () {
                var self = this;
                self.data.openTimes++; // 页面打开次数自增
                setTimeout(function () {
                    _g.dm.preUrl = ''; // 防触摸多次打开多个页面标志 临时记录每个跳转页面的前一个页面地址(url)
                }, 500);
                if (self.data.openTimes >= 2) {
                    // 在第二次打开的时候 执行页面自定义的 onShow 方法
                    onShow && onShow(self);
                }
            },
            onHide: function () {
                // 执行页面自定义的 onShow 方法
                onHide && onHide(this);
            },
            onUnload: function () {
                // 执行页面自定义的 onUnload 方法
                event.remove('location-getSettingData', self);
                onUnload && onUnload(this);
            },
            onShareAppMessage: function (res) {
                if (res.from === 'button') {
                    // 来自页面内转发按钮
                    _g.logger(res.target);
                }
                return _g.shareAppMsg({});
            },
            // 下拉刷新
            onPullDownRefresh: function () {
                var self = this;
                self.data.page = 1;
                if (self.getData) {
                    self.getData();
                }
            },
            // 底部翻页
            onReachBottom: function () {
                var self = this;
                _g.logger('~~~ onReachBottom ~~~~');
                if (self.data.hasNextPage > 0) {
                    // getPageData 方法 为页面定义的获取列表数据的方法
                    if (self.getPageData) {
                        self.data.page++;
                        self.getPageData();
                    }
                } else {
                    if (self.data.hasNextPage == 0) {
                        if (self.data.page == 1) {
                            if (self.data.pageListSize <= 12) {
                                return;
                            }
                        }
                        if (self.getPageData) {
                            self.setData({
                                showBottomLine: true
                            });
                        }
                    }
                }
                _g.logger('~~~ onReachBottom ~~~~ self.data.page ', self.data.page);
            },
            onGotUserInfo: function (e) {
                const self = this;
                if (e.detail.errMsg == 'getUserInfo:fail auth deny') return;
                // const  isLogin = self.data.isLogin;
                // self.setData({
                // 	isLogin: true
                // })
                const detail = e.detail;
                wx.login({
                    success(res) {
                        if (res.code) {
                            detail.code = res.code;
                            _g.setLogin(self, detail, e);
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })

            },
            onPageScroll: function (res) {
                // 执行页面自定义的 onShow 方法
                var self = this;
                self.pageScroll && self.pageScroll(res);
            },
            getPhoneNumber: function (e) {
                console.log(e);
            },
            // 返回上一页
            back: function () {
                _g.navigateBack();
            },
            // 回到首页
            home: function () {
                var self = this;
                _g.switchTab({
                    self: self,
                    url: _c.pages.home.index
                });
            },
            touchStart: function (e) {
                const self = this;
                self.touchStartTime = e.timeStamp;
            },
            touchEnd: function (e) {
                const self = this;
                if (self.data.lastTapTime != e.timeStamp) {
                    if (e.timeStamp - self.data.lastTapTime <= 400) {
                        self.doubleClick(e);
                    }
                }
                self.setData({
                    lastTapTime: e.timeStamp
                });
            },
            longPress: function (e) {
                console.log(e);
            },
            onFormIdTap: function (e) {
                const self = this;
                if (_g.checkLogin({ type: 1 })) {
                    _g.postFormId({
                        self: self,
                        formId: e.detail.formId
                    });

                }
                e.target.dataset['fuc'] && self[e.target.dataset['fuc']](e);
                // console.log(e.target.dataset['fuc'])

            },
            getMyLocation: function () {
                const self = this;
                _g.getLocation().then((res) => {
                    self.setData({
                        myLocation: {
                            lon: res.lon,
                            lat: res.lat
                        }
                    })
                }, (err) => {
                    self.setData({
                        hiddenLocationPopup: false
                    });
                })
            }
        };
        // 初始化页面方法
        _.each(methods, function (val, key) {
            page[key] = val;
        });

        // 初始化模板
        _.each(temps, function (tempVal, tempKey) {
            page.data[tempKey] = tempKey; // 初始化模板名称
            // 初始化模板方法
            var tempOriginObj = _g.clone(_t[tempKey]);
            _.each(tempOriginObj.methods, function (mVal, mKey) {
                page[mKey] = mVal;
            });
            // 初始化页面模板重写方法
            var pageTempMethods = tempVal.methods || {};
            _.each(pageTempMethods, function (pageTempMethodVal, pageTempMethodKey) {
                page[pageTempMethodKey] = pageTempMethodVal;
            });
            // 初始化页面模板的data
            var tempData = tempVal.data;
            if (tempData && _g.j2s(tempData) != '{}') {
                _.each(tempData, function (tempDataVal, tempDataKey) {
                    tempOriginObj.data[tempDataKey] = tempDataVal;
                });
            }
            page.data[tempKey + 'Constant'] = tempOriginObj.data;
        });
        return page;
    },

    /**
     * 发送请求
     * @param opts
     * @param self 微信page对象
     */
    ajax: function (opts, self) {
        var _g = this;
        var self = self || opts.self;
        if (_g.dm.lock) return;
        if (opts.lock) {
            _g.dm.lock = true;
        }
        if (opts.hideToast == false) {
            opts.hideToast = false;
        } else {
            opts.hideToast = true;
        }
        if (opts.showToast == false) {
            opts.showToast = false;
        } else {
            opts.showToast = true;
        }
        delete opts.data.showToast;
        return new Promise(function (resolve, reject) {
            if (!_g.dm.canLoadMore) { // 整体请求 比如: getToken,login 都可能不会在页面总请求,而在app.onLaunch中请求
                _g.dm.canLoadMore = 1;
                return reject('can not load more');
            } else {
                _g.dm.canLoadMore = 0; // 整体请求 设置为不能请求
            }
            if (!opts) return reject('参数不能为空!');
            var showToast = opts.showToast;
            if (showToast) {
                _g.toast({
                    title: '加载中',
                    mask: true,
                    icon: 'loading',
                    duration: opts.duration || 200
                });
            }
            var postData = {};
            var host = _g.getHost();
            if (opts.host) {
                host = opts.host;
            }

            postData.sessionKey = opts.sessionKey || _g.getLS(_c.LSKeys.sessionKey);
            if (_g.getUserInfo()) {
                var userInfo = _g.getUserInfo();
                postData.miniUserId = userInfo.id;
                opts.data.storeId = userInfo.store.id;
            } else {
                if (opts.url != _c.apiUrls.store.storeList) {
                    opts.data.storeId = _g.getLS(_c.LSKeys.storeInfo).id;
                }
            }
            postData.data = JSON.stringify(_g.ksort(opts.data));
            postData.appVersion = _c.version;
            postData.apiVersions = 'v1';
            postData.deviceCode = 'miniApp';
            postData.platform = 0;
            postData.timestamp = Math.round(new Date().getTime() / 1000);
            postData.token = _c.tokenKey;
            postData.token = _md5.go(_g.jsonToPostDataStr(_g.ksort(postData)));

            _g.logger('request url: ' + opts.url + ' 请求参数: ', _g.s2j(postData.data));
            // 数据本地缓存设置
            if (opts.cache) {
                var localData = _g.getLS(opts.cache) ? _g.getLS(opts.cache) : '';
                if (localData) {
                    if (opts.hideToast) {
                        _g.hideToast();
                    }
                    _g.stopPullDownRefresh();
                    _g.logger('localData response -> url: ' + opts.url + ' ->  data: ', localData);
                    var data = localData.data;
                    if (data && data.hasNextPage != undefined) {
                        if (data.hasNextPage === true) {
                            data.hasNextPage = 1;
                        } else {
                            data.hasNextPage = 0;
                        }
                        self.data.hasNextPage = data.hasNextPage;
                        if (data.list) {
                            self.data.pageListSize = data.list.length;
                        }
                    }
                    _g.dm.canLoadMore = 1;
                    opts.success && opts.success(localData);
                    return resolve(localData);
                }
            }
            wx.request({
                method: opts.type || 'POST',
                url: host + opts.url,
                data: postData,
                // header: {'Content-Type': 'application/json'},
                header: { 'content-type': 'application/x-www-form-urlencoded' },

                success: function (res) {
                    _g.dm.lock = false;
                    // 网络请求错误
                    if (res.statusCode != 200) {
                        _g.logger('~~~~~ wx.request ', res);
                        _g.dm.canLoadMore = 1;
                        return reject();
                    }
                    // 自定义请求错误码
                    if (res.data.code != 200) {
                        _g.logger('~~~~~ wx.request ', res.data);
                        _g.dm.canLoadMore = 1;
                        if ([4000, 4001, 4005, 4006].indexOf(res.data.code) > -1) {
                            _g.rmLS(_c.LSKeys.sessionKey);
                            _g.rmLS(_c.LSKeys.userInfo);
                            opts.self = self;
                            _g.wxLogin(opts);
                        } else {
                            _g.toast({
                                title: res.data.message,
                                duration: 3000
                            });
                        }
                        return reject(res.data);
                    }
                    if (opts.hideToast) {
                        setTimeout(function () {
                            _g.hideToast();
                        }, 2000);
                    }
                    _g.stopPullDownRefresh();
                    _g.logger('request url: ' + opts.url + ' 返回结果: ', res.data);
                    var data = res.data.data;

                    if (data && data.hasNextPage != undefined) {
                        if (data.hasNextPage === true) {
                            data.hasNextPage = 1;
                        } else {
                            data.hasNextPage = 0;
                        }
                        self.data.hasNextPage = data.hasNextPage;
                        if (data.list) {
                            self.data.pageListSize = data.list.length;
                        }
                    }
                    // 数据本地缓存设置
                    if (opts.cache) {
                        _g.setLS(opts.cache, res.data);
                    }
                    _g.dm.canLoadMore = 1;
                    opts.success && opts.success(res.data);
                    return resolve(res.data);
                },
                fail: function (err) {
                    _g.dm.lock = false;
                    _g.logger('response err: ', err);
                    _g.dm.canLoadMore = 1;
                    opts.error && opts.error(err);
                    return reject(err);
                },
            });
        });
    },

    /**
     * 获取秒数
     * @param date
     * @returns {number}
     */
    getTimestamp: function (date) {
        var timestamp;
        if ((typeof date) == 'object') {
            timestamp = Date.parse(date);
        } else if (date && (typeof date) == 'string') {
            timestamp = Date.parse(new Date(date.replace(/-/g, "/")));
        } else {
            timestamp = Date.parse(new Date());
        }
        return timestamp / 1000;
    },

    /**
     * obj对象转为json格式的字符串
     * @param obj
     */
    j2s: function (obj) {
        return JSON.stringify(obj);
    },

    /**
     * json格式的字符串转为obj
     * @param str
     */
    s2j: function (str) {
        return JSON.parse(str);
    },

    /**
     * 对象克隆
     * @param obj
     * @returns {*}
     */
    clone: function (obj) {
        var _g = this;
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(_g.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = _g.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },

    /**
     * 获取随机字符串
     * @param len 长度
     * @returns {string}
     */
    randomString: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },

    /**
     * 设置本地缓存
     * @param key
     * @param val
     * @param expireTime 毫秒数 有效时长
     */
    setLS: function (key, val, expireTime) {
        var _g = this;
        var value = {};
        value.val = val;
        if (expireTime) {
            value.expireTime = expireTime;
            value.saveTime = new Date().getTime();
        }
        try {
            wx.setStorageSync(key, _g.j2s(value));
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * 获取本地缓存
     * @param key
     * @returns {*}
     */
    getLS: function (key) {
        var _g = this;
        var result = '';
        if (wx.getStorageSync(key)) {
            var value = _g.s2j(wx.getStorageSync(key));
            if (value.expireTime) {
                if ((new Date().getTime() - value.saveTime) <= value.expireTime) {
                    result = value.val;
                } else {
                    _g.rmLS(key);
                }
            } else {
                result = value.val;
            }
        }
        return result;
    },

    /**
     * 删除单个缓存
     * @param key
     */
    rmLS: function (key) {
        try {
            wx.removeStorageSync(key);
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * 删除所有本地缓存
     */
    rmAllLS: function () {
        try {
            wx.clearStorageSync();
        } catch (e) {
            //console.log(e);
        }
    },

    /**
     * 设置顶部导航栏title
     * @param title
     */
    setNavigationBarTitle: function (title) {
        wx.setNavigationBarTitle({
            title: title
        });
    },

    /**
     * navigateTo 跳转页面
     * @param options
     */
    navigateTo: function (options, self) {
        var _g = this;
        if (_g.dm.preUrl == options.url) {
            return;
        }
        var self = self || options.self;
        _g.dm.prePageUrl = self.route;
        _g.dm.preUrl = options.url;
        _g.dm.param = options.param || {};
        var url = '/' + options.url;
        wx.navigateTo({
            url: url
        })
    },

    /**
     * openWin 跳转页面
     * 重写跳转页面方法
     * @param options
     */
    openWin: function (opts, normal) {
        var _g = this;
        var opts = _.extend({}, opts);
        var self = opts.self;
        if (!opts.url) return;
        if (normal) {
            //abandon
        } else {
            if (_g.dm.preUrl == opts.url) {
                return;
            }
            _g.dm.prePageUrl = self.route;
            _g.dm.preUrl = opts.url;
            _g.dm.param = opts.param || {};
            var mainPages = ['pages/home/index', 'pages/find/index', 'pages/me/index'];
            var url = '/' + opts.url;
            if (mainPages.indexOf(opts.url) > -1) {
                wx.switchTab({
                    url: opts.url
                });
                return;
            }
            wx.navigateTo({
                url: url
            })
        }
    },

    /**
     * redirectTo 跳转页面
     * @param options
     */
    redirectTo: function (options, self) {
        var _g = this;
        if (_g.dm.preUrl == options.url) {
            return;
        }
        var self = self || options.self;
        _g.dm.prePageUrl = self.route;
        _g.dm.preUrl = options.url;
        _g.dm.param = options.param || {};
        var url = '/' + options.url;
        wx.redirectTo({
            url: url
        });
    },

    /**
     * closeToWin 跳转页面
     * @param options
     */
    closeToWin: function () {

    },

    /**
     * switch跳转页面
     * @param options
     */
    switchTab: function (options, self) {
        var _g = this;
        if (_g.dm.preUrl == options.url) {
            return;
        }
        var self = self || options.self;
        _g.dm.prePageUrl = self.route;
        _g.dm.preUrl = options.url;
        var url = '/' + options.url;
        _g.dm.param = options.param || {};
        wx.switchTab({
            url: url
        });
    },

    /**
     * navigateBack 返回
     * @param delta 返回深度
     */
    navigateBack: function (delta) {
        if (getCurrentPages().length > 1) {
            wx.navigateBack({
                delta: delta || 1
            });
        } else {
            wx.switchTab({
                url: '/' + _c.appIndex
            });
        }
    },

    /**
     * closeWin 重写返回 返回
     * @param opts.delta 返回深度
     */
    closeWin: function (opts) {
        if (getCurrentPages().length > 1) {
            wx.navigateBack({
                delta: opts.delta || 1
            });
        } else {
            wx.switchTab({
                url: '/' + _c.appIndex
            });
        }
    },
    /**
     * toast
     * @param msg options
     */
    toast: function (options) {
        /*if (options.mask == false) {
            options.mask = false;
        } else {
            options.mask = true;
        }*/
        wx.showToast({
            title: options.title || '', // 标题
            icon: options.icon || 'none', // 图标
            image: options.image || '', // 自定义图标的本地路径，image 的优先级高于 icon
            mask: options.mask || false, // 是否显示透明蒙层，防止触摸穿透，默认：false
            duration: options.duration || 1000, //提示的延迟时间
            success: function () {
                options.success && options.success();
            }
        });
    },

    /**
     * 隐藏toast
     */
    hideToast: function () {
        wx.hideToast();
    },

    /**
     * 预览图片
     * @param urlsArr
     */
    previewImage: function (urlsArr) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: urlsArr // 需要预览的图片http链接列表
        })
    },

    /**
     * 打开同一公众号下关联的另一个小程序。
     * @param options
     */
    navigateToMiniProgram: function (options) {
        if (!options) options = {};
        var envVersion = '';
        if (_c.env == 'dev') {
            envVersion = 'develop';
        } else if (_c.env == 'test') {
            envVersion = 'trial';
        } else if (_c.env == 'pro') {
            envVersion = 'release';
        }
        wx.navigateToMiniProgram({
            appId: options.appId || _c.appId, // 要打开的小程序 appId
            path: options.path || '', // 打开的页面路径，如果为空则打开首页
            extraData: options.extraData || {}, // 需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
            envVersion: options.envVersion || envVersion, // 有效值 develop（开发版），trial（体验版），release（正式版）
            success(res) {
                // 打开成功
            }
        })
    },

    /**
     * 停止下拉刷新
     */
    stopPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    /**
     * 显示模态框
     * @param opts
     */
    showModal: function (opts) {
        var _g = this;
        wx.showModal({
            title: opts.title || '',
            content: opts.content,
            showCancel: opts.showCancel ? opts.showCancel : false,
            confirmColor: opts.confirmColor || '#3CC51F',
            confirmText: opts.confirmText || '确定',
            cancelColor: opts.cancelColor || '#000000',
            cancelText: opts.cancelText || '取消',
            success: function (res) {
                if (res.confirm) {
                    _g.logger('用户点击确定');
                    opts.confirm && opts.confirm(res);
                } else if (res.cancel) {
                    _g.logger('用户点击取消');
                    opts.cancel && opts.cancel();
                }
            }
        })
    },

    /**
     * 定位
     * @returns {*}
     */
    getLocation: function (type) {
        var _g = this;
        return new Promise(function (resolve, reject) {
            _g.toast({
                title: '请稍等',
                icon: 'loading',
                duration: 1000
            });
            wx.getLocation({
                success: function (data) {
                    var key = 'YLTBZ-SPSRO-PPIWR-SKAML-PNQ72-CWBWC';
                    var getAddressUrl = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + data.latitude + ',' + data.longitude + '&key=' + key + '&get_poi=1';
                    _g.dm.lat = data.latitude;
                    _g.dm.lon = data.longitude;
                    // return resolve(data);
                    wx.request({
                        url: getAddressUrl, //仅为示例，并非真实的接口地址
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {
                            if (res.data.status == 0) {
                                _g.dm.addr = res.data.result.address_component;
                                _g.dm.addr.lon = _g.dm.lon;
                                _g.dm.addr.lat = _g.dm.lat;
                            }
                            return resolve(_g.dm.addr);
                        },
                        fail: function (err) {
                            return reject(err);
                        }
                    });
                },
                fail: function (e) {
                    if (e.errMsg == 'getLocation:fail auth deny') {
                        // _g.toast({title: '用户拒绝授权'});
                    }
                    return reject(e);
                }
            });
        })
    },

    /**
     * 根据经纬度获取详细地址
     * @returns {string}
     */
    getLocationDetail: function (lon, lat) {
        var _g = this;
        return new Promise(function (resolve, reject) {
            var key = 'YLTBZ-SPSRO-PPIWR-SKAML-PNQ72-CWBWC';
            var getAddressUrl = 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + lat + ',' + lon + '&key=' + key + '&get_poi=1';
            wx.request({
                url: getAddressUrl,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    var addr;
                    if (res.data.status == 0) {
                        addr = res.data.result.address_component;
                    }
                    return resolve(addr);
                },
                fail: function (err) {
                    return reject(err);
                }
            });
        })
    },
    /**
     * 根据配置文件中不同的环境获取不同的host
     * @returns {string}
     */
    getHost: function () {
        var host = '';
        if (_c.env == 'dev') {
            host = _c.host.dev;
        } else if (_c.env == 'test') {
            host = _c.host.test;
        } else if (_c.env == 'pro') {
            host = _c.host.pro;
        }
        return host;
    },

    /**
     * promiseWhile
     * @param condition
     * @param body
     * @returns {*}
     */
    promiseWhile: function (condition, body) {
        var done = _q.defer();

        function loop() {
            if (!condition()) return done.resolve();
            _q.when(body(), loop, done.reject);
        }

        _q.nextTick(loop);
        return done.promise;
    },

    getOpenSetting: function () {
        var _g = this;
        return new Promise(function (resolve, reject) {
            wx.getSetting({
                success: function (res) {
                    _g.logger('wx.getSetting ', res);
                    if (!res.authSetting['scope.userInfo'] && res.authSetting['scope.userInfo'] != false) {
                        return resolve();
                    } else {
                        _g.showModal({
                            title: '用户未授权',
                            content: '如需正常使用"竞华招聘"小程序,请按确定后在授权管理中选中"用户信息",点击确定或返回后重新进入小程序后即可正常使用!',
                            confirm: function () {
                                wx.openSetting({
                                    success: function (data) {
                                        if (data) {
                                            if (data.authSetting["scope.userInfo"] == true) {
                                                _g.dm.isRefuseAuthorization = false;
                                                return resolve();
                                            } else {
                                                _g.toast({
                                                    title: '登录失败',
                                                    duration: 1000,
                                                });
                                                return reject();
                                            }
                                        }
                                    },
                                    fail: function () {
                                        _g.logger("设置失败返回数据");
                                        return reject();
                                    }
                                });
                            },
                            cancel: function () {
                                return reject();
                            }
                        });
                    }
                }
            });
        });
    },

    /**
     * 图片处理,替换图片地址,可以动态裁剪
     * @param options
     * @returns {*|string}
     */
    imgGM: function (options) {
        var _g = this;
        var image = options.img || '';
        // console.log('_g.dm.useImgGM ', _g.dm.useImgGM);
        if (_g.dm.useImgGM == 1 && _c.env == 'pro') {
            // if (_c.env == 'pro') {
            if (image) {
                var w = options.width;
                var h = options.height || w;
                image = image.replace(_c.host.pro, _c.host.imgGM) + '?size=' + w + 'x' + h;
            }
        }
        return image;
    },

    /**
     * 分享对象
     * @param options
     * @returns {{title: string, path: string, success: success, fail: fail}}
     */
    shareAppMsg: function (options) {
        var options = options || {};
        var _g = this;
        var title = options.title || _c.shareTitle,
            path = options.path || _c.appIndex;
        if (_g.getUserInfo()) {
            path = path + '?promoCode=' + _g.getUserInfo().promoCode;
        }
        console.log(path);
        _g.logger('the path of shareAppMsg is ', path);
        return {
            title: title,
            path: path,
            success: function (res) {
                // 转发成功
                _g.logger('onShareAppMessage success : ', res);
            },
            fail: function (res) {
                // 转发失败
                _g.logger('onShareAppMessage fail : ', res);
            }
        };
    },

    /**
     * 数组去重
     * @param arr
     * @returns {Array}
     */
    arrUnique: function (arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    },

    /**
     * 输出日志
     * @param str obj
     */
    logger: function () {
        if (!_c.debug || _c.env == 'pro') return;
        this.logger = console.log;
    },

    /**
     * 验证手机号码
     * @param $poneInput
     * @returns {boolean}
     */
    isPhone: function (phone) {
        var myreg = /^[0-9]{11}$/;
        if (!myreg.test(phone)) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * 参数排序
     * @param a
     * @param b
     * @returns {boolean|{}}
     */
    ksort: function (a, b) {
        var e, f, g, c = {},
            d = [],
            h = this,
            i = !1,
            j = {};
        switch (b) {
            case "SORT_STRING":
                e = function (a, b) {
                    return h.strnatcmp(a, b)
                };
                break;
            case "SORT_LOCALE_STRING":
                var k = this.i18n_loc_get_default();
                e = this.php_js.i18nLocales[k].sorting;
                break;
            case "SORT_NUMERIC":
                e = function (a, b) {
                    return a + 0 - (b + 0)
                };
                break;
            default:
                e = function (a, b) {
                    var c = parseFloat(a),
                        d = parseFloat(b),
                        e = c + "" === a,
                        f = d + "" === b;
                    return e && f ? c > d ? 1 : d > c ? -1 : 0 : e && !f ? 1 : !e && f ? -1 : a > b ? 1 : b > a ? -1 : 0
                }
        }
        for (g in a) a.hasOwnProperty(g) && d.push(g);
        for (d.sort(e), this.php_js = this.php_js || {}, this.php_js.ini = this.php_js.ini || {}, i = this.php_js.ini["phpjs.strictForIn"] && this.php_js.ini["phpjs.strictForIn"].local_value && "off" !== this.php_js.ini["phpjs.strictForIn"].local_value, j = i ? a : j, f = 0; f < d.length; f++) g = d[f], c[g] = a[g], i && delete a[g];
        for (f in c) c.hasOwnProperty(f) && (j[f] = c[f]);
        return i || j
    },

    /**
     * 参数格式化
     * @param json
     * @returns {string}
     */
    jsonToPostDataStr: function (json) {
        var PostDataStr = '';
        for (var i in json) {
            PostDataStr += i + '=' + json[i] + '&';
        }
        return PostDataStr == '' ? PostDataStr : PostDataStr.slice(0, -1);
    },

    param2Obj: function (str) {
        var obj = {};
        var str1 = str.split('&');
        for (var i = 0; i < str1.length; i++) {
            var str2 = str1[i].split('=');
            obj[str2[0]] = str2[1];
        }
        return obj;
    },

    obj2Param: function (obj) {
        var arr = [];
        for (var key in obj) {
            arr.push(key + '=' + obj[key]);
        }
        console.log(arr.join('&'));
        return arr.join('&');
    },
    chooseImage: function (options) {
        var _g = this;
        return new Promise(function (resolve, reject) {
            wx.chooseImage({
                // count: 9,
                // sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                // sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有

                // album 从相册选图，camera 使用相机，默认二者都有
                sourceType: options.sourceType || ['album', 'camera'],
                // original 原图，compressed 压缩图，默认二者都有
                sizeType: options.sizeType || 'compressed',
                // 最多可以选择的图片张数，默认9
                count: options.count || 9,

                // 成功则返回图片的本地文件路径列表 tempFilePaths
                success: function (result) {
                    _g.logger('~~~ wx.chooseImage -> success ~~~', result);
                    if (options.success) {
                        options.success(result);
                        return resolve(result);
                    } else {
                        _g.onUpload({
                            imageList: result.tempFilePaths,
                            page: options.page,
                            success: options.uploadSuc
                        });
                        return resolve();
                    }
                },
                // 接口调用失败的回调函数
                fail: function (error) {
                    _g.logger('~~~ wx.chooseImage -> fail ~~~', error);
                    options.fail && options.fail(error);
                    return reject(error);
                }
            });
        });
    },
    onUpload: function (options) {
        var _g = this;
        var imageList = options.imageList;
        var index = 0;
        var allChoseCount = imageList.length;
        var uploadImgs = [];
        _g.promiseWhile(function () {
            return index < allChoseCount;
        }, function () {
            _g.toast({
                title: '上传第' + (index + 1) + '张图片',
                icon: 'loading',
                duration: 100000
            });

            var host = _g.getHost();
            var uploadUrl = host + _c.apiUrls.ajaxUpload;
            return _q.Promise(function (resolve, reject) {
                wx.uploadFile({
                    url: uploadUrl,
                    filePath: imageList[index],
                    name: 'file',
                    formData: {
                        'sessionKey': _g.getLS(_c.LSKeys.sessionKey)
                    },
                    success: function (res) {
                        index++;
                        var response = JSON.parse(res.data);
                        _g.logger(response);
                        if (response.code != 200) {
                            _g.toast({
                                title: response.message,
                                duration: 1000,
                            });
                            return reject(res);
                        }
                        var src = response.data.imgUrl;
                        uploadImgs.push(src);
                        return resolve(src);
                    },
                    fail: function (res) {
                        _g.toast({
                            title: '网络错误',
                            duration: 1000,
                        });
                        return reject(res);
                    }
                });
            });
        }).then(function () {
            setTimeout(function () {
                _g.hideToast();
                if (options.success) {
                    options.success(uploadImgs);
                } else {
                    var self = options.page;
                    self.setData({
                        uploadedImgs: uploadImgs
                    });
                }
            }, 1000);
        }).done();
    },
    requestPayment: function (opts) {
        var _g = this;
        wx.requestPayment({
            timeStamp: opts.timeStamp,
            nonceStr: opts.nonceStr,
            package: opts.package,
            signType: opts.signType,
            paySign: opts.paySign,
            success: function (res) {
                _g.logger(res);
                _g.toast({
                    title: '支付成功~'
                });
                opts.success && opts.success();
            },
            fail: function (err) {
                _g.logger(err);
                opts.fail && opts.fail();
            }
        })
    },
    getStatusBarHeight: function () {
        let _g = this;
        return _g.getLS('statusBarHeight');
    },
    getHeaderHeight: function () {
        let _g = this;
        let headerHeight = 0;
        const statusBarHeight = _g.getLS('statusBarHeight');
        // const buttonRect = _g.getLS('menuButtonBoundingClientRect');
        /*
            由于获取胶囊的位置的API有bug,不能通用,所以采用固定高度方法
            胶囊的rect
            rect:{
                height: 32,
                top: 6
            }
            12是根据设计稿胶囊到头部下方的高度确定的
        */
        // headerHeight = 32 + 12 + 6;
        headerHeight = 44;

        //headerHeight = ((buttonRect.top - statusBarHeight) + 12 + buttonRect.height).toFixed(0);

        return {
            headerHeight: headerHeight
            // button2StatusBar: buttonRect.top - statusBarHeight //忘记有什么用了
        };
    },
    getSystemInfo: function () {
        let systemInfo;
        wx.getSystemInfo({
            success(res) {
                systemInfo = res;
            }
        });
        return systemInfo;
    },
    getCurrentPage: function () {
        return getCurrentPages()[getCurrentPages().length - 1].__route__;
    },
    transNum: function (num) {
        if (num > 10000) return num / 10000 + '万';
        return num;
    },
    // 获取上一个页面
    getPrevPage: function () {
        var _g = this;
        var pages = getCurrentPages();
        if (pages.length < 2) {
            _g.logger("没有上一页");
            return null;
        }
        var prevPage = pages[pages.length - 2]; //上一个页面
        return prevPage;
    },
    logErrorMsg: function (err) {
        const _g = this;
        _g.logger(err);
        if ([4000, 4001, 4005, 4006,
            5015, 5016, 5021, 5022, 5023].indexOf(err.code) < 0) {
            _g.toast({
                title: err.message
            });
        }
    },
    initializeClock(page) {
        let timeInterval = setInterval(function () {
            let startTime = page.data.startTime;
            page.setData({
                startTime: startTime + 1
            })
        }, 1000);
        page.setData({
            timeInterval: timeInterval
        });
    },
    getCurrTimeAndInitializeClock(page) {
        const self = this;
        self.getCurrTime(page, function (time) {
            page.setData({
                startTime: time
            });
            self.initializeClock(page);
        }, function (error) {
            _g.logErrorMsg(error);
        });
    },
    downloadImg(req, callback, error) {
        wx.downloadFile({
            url: req.imgUrl,
            success(res) {
                if (res.statusCode === 200) {
                    wx.getImageInfo({
                        src: res.tempFilePath,
                        success(res) {
                            callback && callback({
                                imgUrl: res.path
                            });
                        },
                        fail(err) {
                            error && error(err);
                        }
                    })
                }
            },
            fail(err) {
                error && error(err);
            }
        })
    },
    joinFormId: function (page, type, id) {
        if (type == _c.formIdType.navigation) {
            return page + ':' + 'navigation' + ':' + id;
        }
    },
    getCurrentPageUrl: function () {
        var pages = getCurrentPages(); //获取加载的页面
        var currentPage = pages[pages.length - 1]; //获取当前页面的对象
        var url = currentPage.route; //当前页面url
        return url;
    },
    postFormId: function (opts) {
        if (opts.formId == 'the formId is a mock one') return;
        const _g = this;
        const Platform = require('../service/Platfrom');
        Platform.formId(opts.self, {
            formId: opts.formId,
            showToast: false
        }).then(function (ret) {

        }, function (error) {
            _g.logErrorMsg(error);
        });
    },
    getAuthorize: function (opts, callback) {
        wx.getSetting({
            success(res) {
                callback && callback(res.authSetting[opts.type]);
            }
        });
    },
    checkSDKVersion: function (compareVersion) {
        //用于检查当前版本是否低于传入的版本号
        const _g = this;
        let nowVersion = _g.getLS(_c.LSKeys.systemInfo).SDKVersion;
        return nowVersion.replace('.', '') >= compareVersion.replace('.', '')
    },
    getDataByUrl: function (search) {
        var theRequest = new Object();
        var strs = search.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest;
    },
    checkLogin: function (opts) {
        const _g = this;
        //opts.type  1.不跳转 2.跳转
        //opts.self 
        if (_g.getLS(_c.LSKeys.sessionKey) && _g.getLS(_c.LSKeys.userInfo)) {
            return true;
        } else {
            if (opts.type == 1) {
                return false
            } else if (opts.type == 2) {
                _g.toast({
                    title: '请先登录'
                })
                // _g.openWin({
                //     self: opts.self,
                //     url: 'pages/account/login'
                // });
                return false;
            }
        };
    },
    checkUnionId: function () {
        const _g = this;
        const userInfo = _g.getUserInfo();
        if (userInfo.unionId) {
            return true;
        } else {
            return false;
        }
    },
    setLogin: function (self, opts, e) {
        const _g = this;
        const User = require('../service/User');
        User.login(self, {
            lon: self.data.myLocation.lon,
            lat: self.data.myLocation.lat,
            jsCode: opts.code,
            rawData: opts.rawData,
            signature: opts.signature,
            encryptedData: opts.encryptedData,
            iv: opts.iv,
            promoCode: _g.getLS('promoCode') || '',
            storeId: _g.getLS('storeInfo').id
        }).then((ret) => {
            _g.setLS(_c.LSKeys.sessionKey, ret.data.sessionKey);
            _g.getMyInfo(self, {
                type: 'login',
                e: e
            });
            self.setData({
                isLogin: true
            })
        }, (err) => {
            //TODO login fail
            _g.toast({
                title: '登录失败,请重试'
            });
        });
    },
    getMyInfo: function (self, opts) {
        const _g = this;
        const User = require('../service/User');
        User.getMyInfo(self, {}).then((ret) => {
            _g.setLS(_c.LSKeys.userInfo, ret.data.myInfo);
            if (opts.type == 'login') {
                event.emit('login-suc', {
                    userInfo: ret.data.myInfo
                });
                // event.emit('refreshStep');
            } else {
                opts.suc && opts.suc();
            }
            if (opts.e && opts.e.currentTarget.dataset.fuc) {
                let fuc = opts.e.currentTarget.dataset.fuc;
                self[fuc]();
            }
        }, (err) => {
            //TODO login fail
            opts.fail && opts.fail();
        });
    },
    getShareCode(self) {
        var _g = this;
        const Platform = require('../service/Platfrom');
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        let page = 'pages/home/index?promoCode=' + userInfo.promoCode;
        // console.log(page)
        Platform.getShareQR(self, {
            page: 'pages/home/index?promoCode=' + userInfo.promoCode
        }).then((ret) => {
        }, (err) => {
        });
    },
    wxLogin(opts) {
        const _g = this;
        wx.getUserInfo({
            success(res) {
                let detail = res;
                wx.login({
                    success(res) {
                        if (res.code) {
                            detail.code = res.code;
                            _g.setLogin(opts.self, detail);
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            }
        })
    },
    getGoodsPosterBg(self) {
        const _g = this;
        const host = _c.host[_c.env];
        const User = require('../service/User');
        if (!_g.getLS('goodsPosterBg')) {
            User.getPoster(self, {
                type: 2
            }).then(({ data }) => {
                if (data.poster) {
                    wx.downloadFile({
                        url: `${host}${data.poster}`,
                        success(res) {
                            if (res.statusCode === 200) {
                                wx.getImageInfo({
                                    src: res.tempFilePath,
                                    success(res) {
                                        _g.setLS('goodsPosterBg', res);
                                    },
                                    fail(err) {
                                        wx.hideLoading();
                                    }
                                });
                            }
                        }
                    });
                }
                // console.log()
                // self.downloadImg({
                //     imgUrl: self.data.host +  ret.data.poster
                // }, (res) => {
                //     self.setData({
                //         picThumb: res
                //     });
                //     _g.setLS('posterThumb', res);
                // });
                // self.checkDownload();
            }, (err) => {
            });
        }
    },
    userLinkUser(self) {
        const _g = this;
        const User = require('../service/User');
        let postData = {
            promoCode: _g.getLS(_c.LSKeys.promoCode),
            userId: _g.getLS(_c.LSKeys.userInfo).id
        };
        User.userLinkUser(self, postData).then((ret) => {
            _g.rmLS(_c.LSKeys.promoCode);
            if (ret.data.result == 1) {
                _g.getMyInfo(self , {
                    suc() {
                        event.emit('refreshHomeData')
                    }
                })
            }
        }, (err) => {
            //TODO 失败
        });
    }
};


base.prototype.constructor = base;
module.exports = new base();