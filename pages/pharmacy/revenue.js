// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {};
const onLoad = function (self) {
	self.setData({
		userInfo: _g.getLS(_c.LSKeys.userInfo)
	})
	self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function (e) {
		let self = this;
		self.getCommissionBaseInfo();
	},
	getCommissionBaseInfo: function () {
		let self = this;
		User.getCommissionBaseInfo(self, {
        }).then((ret) => {
            self.setData({
				rewardInfo: ret.data
			})
        }, (err) => {
           
        });
	},
	//跳转到佣金明细
	onCommissionTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/pharmacy/commission',
			param: {
				money: self.data.rewardInfo.money
			}
		}, self);
	},
	//跳转到提现申请
	onApplicationTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/pharmacy/application',
			param: {
				money: self.data.rewardInfo.money,
			}
		}, self);
	},
	//跳转到我的二维码，分享
	onPersonalTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/me/qr',
		}, self);
	},
	//跳转到我的客户
	onCheckCustom: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/pharmacy/customer',
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
});
Page(initPage);