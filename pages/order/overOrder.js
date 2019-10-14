const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	showModal: false,
	orderList: [
		{
			applyCreateTime: 1570861403,
			goodsList: [{
				costPrice: null,
				goodNo: null,
				goodsId: 53,
				imgUrl: "/upload/20190916_8801b8d0-29c9-47eb-b190-b5a782b9653b.jpg",
				nowPrice: null,
				num: 1,
				orderItemId: null,
				originPrice: null,
				price: 88,
				specificationName: null,
				title: "牛初乳奶片",
			}],
			id: 2,
			num: 0,
			orderAddress: { id: 42, name: "大白", phone: "15677220282", address: "广东省广州市天河区车陂大岗路14号", distance: null },
			orderAddressJSON: { "address": "广东省广州市天河区车陂大岗路14号", "areaId": 0, "areaName": "天河区", "cityId": 0, "cityName": "广州市", "createTime": 0, "createUser": 0, "houseNumber": "45号", "id": 42, "isDefault": 1, "isDel": 0, "lat": "23.127695", "lon": "113.39555", "provinceId": 0, "provinceName": "广东省", "receiverName": "大白", "receiverPhone": "15677220282", "showAddress": "WowWay公寓(车陂店)", "updateTime": 0, "updateUser": 0, "userId": 40 },
			orderCreateTime: 1570860854,
			orderNo: "15708608543525718",
			payTime: 0,
			reason: "不想要了",
			refund: 0,
			status: 1,
			type: 0,
		}
	],
};
const onLoad = function (self) {

};
const onShow = function (self) {

};
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	//跳转到对应的状态页
	onOrderDetailTap: function (options) {
		let self = this;
		_g.navigateTo({
			param: {
				id: options.currentTarget.dataset.id,
			},
			url: 'pages/order/overOrderdetails',
		}, self);
	},
	//跳转到申请售后
	onAfterApplicationTap: function (e) {
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