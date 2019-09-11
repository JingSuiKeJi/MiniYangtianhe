// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
    userInfo: {}, //用户信息
    inviterId: '', //输入的邀请人id
    showInvite: false, //显示邀请人信息
    isLogin: false, //是否登录
};
const onLoad = function(self) {
    // wx.hideTabBar()
    self.getTabBar().setData({
        selected: 4
    });
    if (_g.checkLogin({
            type: 1
        })) {
    	self.setData({
    		isLogin: true
    	});
        self.getMyInfo();
    }

    event.on('login-suc', self, (data) => {
        let userInfo = data.userInfo;
        self.setData({
            userInfo: userInfo, //用户信息
            nickName: userInfo.nickname, //用户名
            avatar: userInfo.avatar, //用户头像
            id: userInfo.id, //用户id
            memberId: userInfo.memberId, //会员号
            wxNo: userInfo.wxNo, //微信号
            phone: userInfo.phone, // 手机号
            promoCode: userInfo.promoCode, //邀请码
            points: userInfo.points, //福气
            couponNum: userInfo.couponNum, //优惠券数量
            money: userInfo.money, //收益
            orderNum: userInfo.orderNum, //订单类别
            inviter: userInfo.inviter, //邀请人信息
            // distribution:userInfo.distribution, // 分销身份
            // verifier:userInfo.verifier, // 核销员身份
            // isRemindShare:userInfo.isRemindShare, // 分享成功提醒：1.是 0.否
            // isRemindCoupon:userInfo.isRemindCoupon, // 优惠券获得提醒：1.是 0.否
            // isRemindCut:userInfo.isRemindCut, // 砍价提醒：1.是 0.否
            // store:userInfo.store// 绑定门店
        })
    });
};

const onShow = function(self) {
    if (_g.checkLogin({
            type: 1
        })) {
        self.getMyInfo();
    }
};

const onReady = function(self) {};

const onUnload = function(self) {
    event.remove('login-suc', self);
};

const methods = {
    getData: function() {

    },
    getMyInfo() {
        const self = this;
        _g.getMyInfo(self, {
            suc() {
                self.setData({
                    userInfo: _g.getLS(_c.LSKeys.userInfo)
                });
            }
        })
    },
    // 退出登录
    onLogOutTap: function() {
        var self = this;
        const inviter = self.data.userInfo.inviter;
        //登出接口
        User.logout(self, {
            sessionKey: _g.getLS(_c.LSKeys.sessionKey)
        }).then((ret) => {
            let data = ret.data;
            // 清除本地缓存用户信息
            _g.rmLS(_c.LSKeys.userInfo);
            // 清除本地缓存sessionKey
            _g.rmLS(_c.LSKeys.sessionKey);
            //通知所有页面退出登录
            event.emit('logout-suc');
            // 渲染层更新用户信息
            self.setData({
                userInfo: {}, //用户信息置空
                inviter: '', //邀请人信息置空
                isLogin: false, //退出登录
            })
        }, (err) => {});
    },
    //保存邀请人信息
    onSaveInviterInfo: function() {
        const self = this;
        //获取输入id
        const inviterId = self.data.inviterId;
        self.setData({
            inviterId: inviterId,
        });
        //调用邀请人接口
        User.bindRecommend(self, {
            memberId: inviterId,
        }).then((ret) => {
            self.getMyInfo();
        }, (err) => {
            console.log("获取失败");
        });
    },
    //显示隐藏邀请人信息
    onDevelopInviterInfo: function() {
        const self = this;
        self.setData({
            showInvite: !self.data.showInvite
        });
    },
    //获取邀请人输入框内容
    inviterIdInput: function(e) {
        const self = this;
        const inviterId = self.data.inviterId;
        self.setData({
            inviterId: e.detail.value
        })
    },
    //清空文本
    onEmpty: function(e) {
        const self = this;
        const inviterId = self.data.inviterId;
        self.setData({
            inviterId: ''
        });
    },
    //跳转到分享海报
    onPersonalTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/poster',
        }, self);
    },
    //跳转到福气明细
    onBlissDetailTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/blissDetail',
        }, self);
    },
    //跳转到优惠券
    onDiscountsTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/pharmacy/discounts',
        }, self);
    },
    //跳转到门店申请
    onStoreApplicationTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/storeApplication',
        }, self);
    },
    //跳转到收益中心
    onRevenueTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/pharmacy/revenue',
        }, self);
    },
    //跳转到我的订单
    onMyOrderTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/order/index',
        }, self);
    },
    //跳转到待支付
    onPayTap: function() {
        let self = this;
        _g.navigateTo({
            param: {
                currentCheck: 1
            },
            url: 'pages/order/index',
        }, self);
    },
    //跳转到待发货
    onShippingTap: function() {
        let self = this;
        _g.navigateTo({
            param: {
                currentCheck: 2
            },
            url: 'pages/order/index',
        }, self);
    },
    //跳转到待收货
    onReceivingTap: function() {
        let self = this;
        _g.navigateTo({
            param: {
                currentCheck: 3
            },
            url: 'pages/order/index',
        }, self);
    },
    //跳转到已签收
    onSignedTap: function() {
        let self = this;
        _g.navigateTo({
            param: {
                currentCheck: 4
            },
            url: 'pages/order/index',
        }, self);
    },
    //跳转到售后订单
    onAfterSaleTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/order/afterSale',
        }, self);
    },
    //跳转到门店中心
    onStoreTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/shop/store',
        }, self);
    },
    //跳转到我的评论
    onMyCommentTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/order/myComment',
        }, self);
    },
    //跳转到地址管理
    onAddressHandleTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/myAddress',
        }, self);
    },
    //跳转到消息通知
    onMessageInformTap: function() {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/messageInform',
        }, self);
    },
    //跳转到绑定微信
    onBindingWeChat: function() {
        let self = this;
        const userInfo = self.data.userInfo;
        _g.navigateTo({
            param: {            wxNo: userInfo.wxNo          },
            url: 'pages/me/bindingWeChat',
        }, self);
    },
    //跳转到绑定手机
    onBindingPhone: function() {
        let self = this;
        const userInfo = self.data.userInfo;
        _g.navigateTo({
            param: {            phone: userInfo.phone          },
            url: 'pages/me/bindingPhone',
        }, self);
    }
}

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onUnload: onUnload,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    temps: temps,
    Component: Component,
});
Page(initPage);