// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	showNikeName:false,//用户信息
	showModal: false,//模态框
	saveInvite:false,//保存邀请人信息
	showInvite:false,//显示邀请人信息,
	inviterName:'',
	sendGoodsNum:true,//待发货个数
	waitReceiving:false,//待收货个数
	logOut:false,
};
const onLoad = function(self) {
	// wx.hideTabBar()
	self.getTabBar().setData({
		selected: 4
	});
	event.on('login-suc', self, ()=>{
		
	});
};
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//显示模态框
	showDialogBtn: function () {
		const self = this;
		self.setData({
		  showModal: true
		})
	},
	//隐藏模态框
	hideModal: function () {
		const self = this;
		self.setData({
		  showModal: false
		});
	},
	//关闭模态框
	onCancel: function () {
		const self = this;
		self.hideModal();
	},
	//确认信息
	onConfirm: function () {
		const self = this;
		self.hideModal();
		self.setData({
			showNikeName:true,
			sendGoodsNum:true,
			waitReceiving:true,
			logOut:true
		})
	},
	// 退出登录
	onLogOutTap: function () {
		const self = this;
		self.setData({
			showNikeName:false,
			sendGoodsNum:false,
			waitReceiving:false,
			logOut:false
		})
	},
	//保存邀请人信息
	onSaveInviterInfo:function(){
		const self = this;
		self.setData({
		  saveInvite:true
		});
	},
	//显示隐藏邀请人信息
	onDevelopInviterInfo:function(){
		const self = this;
		self.setData({
		  showInvite:!self.data.showInvite
		});
	},
	//获取邀请人输入框内容
	inviterNameInput:function(e){
		const self = this;
		self.setData({
			inviterName:e.detail.value
		})
	},
	//清空文本
	onEmpty:function(e){
		const self = this;
		const inviterName=self.data.inviterName;
		self.setData({
		  inviterName:''
		});
	},
	//跳转到分享海报
	onPersonalTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/me/poster',
	    }, self);
	},
	//跳转到福气明细
	onBlissDetailTap:function () {
		let self = this;
		_g.navigateTo({
		    url: 'pages/me/blissDetail',
		}, self);
	},
	//跳转到优惠券
	onDiscountsTap:function(){
		let self = this;
		_g.navigateTo({
		    url: 'pages/pharmacy/discounts',
		}, self);
	},
	//跳转到门店申请
	onStoreApplicationTap:function () {
		let self = this;
		_g.navigateTo({
		    url: 'pages/me/storeApplication',
		}, self);
	},
	//跳转到收益中心
	onRevenueTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/pharmacy/revenue',
	    }, self);
	},
	//跳转到我的订单
	onMyOrderTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/order/index',
	    }, self);
	},
	//跳转到待支付
	onPayTap: function () {
	    let self = this;
	    _g.navigateTo({
			param:{
				currentCheck:1
			},
	        url: 'pages/order/index',
	    }, self);
	},
	//跳转到待发货
	onShippingTap: function () {
	    let self = this;
	    _g.navigateTo({
			param:{
				currentCheck:2
			},
	        url: 'pages/order/index',
	    }, self);
	},
	//跳转到待收货
	onReceivingTap: function () {
	    let self = this;
	    _g.navigateTo({
			param:{
				currentCheck:3
			},
	        url: 'pages/order/index',
	    }, self);
	},
	//跳转到已签收
	onSignedTap: function () {
	    let self = this;
	    _g.navigateTo({
			param:{
				currentCheck:4
			},
	        url: 'pages/order/index',
	    }, self);
	},
	//跳转到售后订单
	onAfterSaleTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/order/afterSale',
	    }, self);
	},
	//跳转到门店中心
	onStoreTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/pharmacy/store',
	    }, self);
	},
	//跳转到我的评论
	onMyCommentTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/order/myComment',
	    }, self);
	},
	//跳转到地址管理
	onAddressHandleTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/me/myAddress',
	    }, self);
	},
	//跳转到消息通知
	onMessageInformTap: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/me/messageInform',
	    }, self);
	},
	//跳转到绑定微信
	onBindingWeChat: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/me/bindingWeChat',
	    }, self);
	},
	//跳转到绑定手机
	onBindingPhone: function () {
	    let self = this;
	    _g.navigateTo({
	        url: 'pages/me/bindingPhone',
	    }, self);
	}
}

// 有引用template时定义
const temps = {
};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onUnload: onUnload,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    temps: temps,
	Component:Component,
});
Page(initPage);