// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	result: ''
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//跳转到我的客户
	onMyCustomerTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/me/myCustomer',
		}, self);
	},
	//跳转到我的店员
	onMyAssistantTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/me/myAssistant',
		}, self);
	},
	//跳转到订单管理
	onOrderManageTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/order/orderManage',
		}, self);
	},
	//跳转到财务报表
	onStatementsTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/pharmacy/statements',
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
		    url: 'pages/pharmacy/storeQRCode',
		}, self);
	},
	//跳转到福气核销
	onBlissVerifyTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/pharmacy/blissVerify',
		}, self);
	},
	//跳转到福气核销明细
	onBlissVerifyDetailTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/pharmacy/blissVerifyDetail',
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