// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	list: [],
	showModal:false,//取消售后模态框
};
const onLoad = function(self) {
	self.setData({
	    id: self.data.id
	});
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function (e) {
		let self = this;
		Order.afterorderDetails(self, {
			id: self.data.id
		}).then((ret) => {
			self.setData({
				list:ret.data
			})
        }, (err) => {
			
        });
	},
	// 取消售后
	onCancelServiceTap: function () {
		this.setData({
		  showModal: true
		})
	},
	hideModal: function () {
		this.setData({
		  showModal: false
		});
	},
	onCancel: function () {
		this.hideModal();
	},
	onConfirm: function () {
		let self = this;
		const orderStatus = '售后结束';
		_g.navigateTo({
			param:{
		    	orderStatus:orderStatus
		    },
			url: 'pages/order/afterDetails',
		}, self);
		self.hideModal();
	},
	//跳转到申请退款
	onApplyRefundTap:function(){
		let self = this;
		_g.navigateTo({
			param: {
				orderId: e.currentTarget.dataset.orderid
			},
			url: 'pages/order/applyAfter',
		}, self);
	},
	onCommentTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/postComment',
		}, self);
	},
	onLogisticsTap: function (e) {
		let self = this;
		_g.navigateTo({
			param: {
			},
			url: 'pages/order/fillLogistics',
		}, self);
	},
	onBackTap: function (e) {
		let self = this;
		_g.switchTab({
			url: 'pages/home/index',
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