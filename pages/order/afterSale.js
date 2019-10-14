// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	menuList:[
		// {name:"已过期",currentId:1},
		{name:"全部",currentId:1},
		{name:"处理中",currentId:2},
		{name:"已完成",currentId:3}
	],
	currentCheck: 1,
	showModal: false,
	orderList:[],
};
const onLoad = function(self) {
	self.getPageData();
};
const onShow = function(self) {
	
};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	getPageData: function (options) {
	   let self = this;
	   let param = {
			page: self.data.page,
			pageSize: 20,
			statsus: self.data.currentCheck,
			orderNo: self.data.inputValue
			
	   }
        Order.afterorderList(self, param).then((ret) => {
			self.setData({
				orderList: self.data.orderList.concat(ret.data.list)
			})
        }, (err) => {
			
        });
	},
	//选择菜单状态
	chooseMenu:function(options){
		let self = this;
		//设置当前样式
		self.setData({
			currentCheck:options.currentTarget.dataset.id,
			page: 1,
            orderList: []
		});
		self.getPageData();
	},
	//跳转到对应的状态页
	onOrderDetailTap:function(options){
		let self = this;
		_g.navigateTo({
			param:{
				id:options.currentTarget.dataset.id,
		    },
			url: 'pages/order/afterDetails',
		}, self);
	},
	//跳转到申请售后
	onAfterApplicationTap:function(e){
		let self = this;
		_g.navigateTo({
			param: {
				orderId: e.currentTarget.dataset.orderid
			},
			url: 'pages/order/applyAfter',
		}, self);
	},
	onInputTap: function (e) {
		let self = this;
		self.setData({
			inputValue: e.detail.value 
		});
	},
	onConfirmTap: function (e) {
		let self = this;
		self.setData({
			inputValue: e.detail.value,
			page: 1,
			orderList: []
		});
		self.getPageData();
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