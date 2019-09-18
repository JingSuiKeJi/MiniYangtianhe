// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	userInfo:{},//用户信息
	result: '',//核销照片本地地址
	centerInfo:{},//门店中心信息
};
const onLoad = function(self) {
	self.getMyInfo();
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getMyInfo() {
	    const self = this;
		const userInfo = self.data.userInfo;
	    self.setData({
	        userInfo: _g.getLS(_c.LSKeys.userInfo),
	    });
	},
	getData: function() {
		let self = this;
		User.getBaseInfo(self, {
		}).then((ret) => {
		    let centerInfo = ret.data;
			self.setData({
				centerInfo:centerInfo
			})
		}, (err) => {
		    console.log("获取失败");
		});
	},
	//跳转到我的客户
	onMyCustomerTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/shop/myCustomer',
		}, self);
	},
	//跳转到我的店员
	onMyAssistantTap:function(){
		let self = this;
		const userInfo = self.data.userInfo;
		_g.navigateTo({
			param:{
				storeId:userInfo.store.id,
			},
		    url: 'pages/shop/myAssistant',
		}, self);
	},
	//跳转到订单管理
	onOrderManageTap:function(){
		let self = this;
		const userInfo = self.data.userInfo;
		_g.navigateTo({
			param:{
				storeId:userInfo.store.id,
			},
		    url: 'pages/shop/orderManage',
		}, self);
	},
	//跳转到财务报表
	onStatementsTap:function(){
		let self = this;
		const userInfo = self.data.userInfo;
		_g.navigateTo({
			param:{
				storeId:userInfo.store.id,
			},
		    url: 'pages/shop/statements',
		}, self);
	},
	//打开扫码核销
	getScancode: function() {
		var self = this;
		// 允许从相机和相册扫码
		wx.scanCode({
			// onlyFromCamera:false,
			scanType:['qrCode','barCode'],
			success: res => {
				var result = res.result;
				self.setData({
					result: result,
				})
				_g.navigateTo({
				    url: 'pages/me/blissVerific',
				}, self);
			},
			fail: res => {
				// 接口调用失败
				// wx.showToast({
				// 	icon: 'none',
				// 	title: '接口调用失败！'
				// })
			},
			complete: res => {
				// 接口调用结束
				
			}
		})
	},
	//跳转到门店二维码
	onStoreQRCodeTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/shop/storeQRCode',
		}, self);
	},
	//跳转到福气核销
	onBlissVerifyTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/shop/blissVerify',
		}, self);
	},
	//跳转到福气核销明细
	onBlissVerifyDetailTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/shop/blissVerifyDetail',
		}, self);
	},
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