const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	list: {
		"id": 2,
		"orderNo": "15708608543525718",//订单编号
		"orderCreateTime": 1570860854,//订单创建时间
		"payTime": 0,//订单支付时间
		"orderAddress": {
			   "id": 42,
			   "name": "大白",
			   "phone": "15677220282",
			   "address": "广东省广州市天河区车陂大岗路14号"
		   },
		   "status": 1,// 售后状态：1.处理中 2.同意 3.拒绝 4.撤回 5.退款成功
		   "type": 1,//售后类型：1.仅退款 2.退货退款 3.换货
		   "goodsList": [
			   {
				   "orderItemId": null,
				   "goodsId": 53,
				   "imgUrl": "/upload/20190916_8801b8d0-29c9-47eb-b190-b5a782b9653b.jpg",
				   "title": "牛初乳奶片",
				   "specificationName": null,//规格昵称
				   "price": 88,
				   "num": 1  
			   }
		   ],
		   "reason": "不想要了",//申请原因
		   "refund": 20,//申请退款金额
		   "num": 1,//申请数量
		   "applyCreateTime": 1570861403//申请时间  
	},
	showModal:false,//取消售后模态框
};
const onLoad = function(self) {

}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	
	// 取消售后
	hideModal: function () {
		this.setData({
		  showModal: false
		});
	},
	onCancel: function () {
		this.hideModal();
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