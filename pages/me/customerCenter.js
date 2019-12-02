// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	nickname: '客户中心',//接收上一页选择的顾客用户名,默认客户中心
	userId: '1',//接收上一页选择的顾客id，1为测试数据
	clientInfo: {},//客户信息
	nowMonth: '',//当前月
	addressList: [],
	orderList: [
		// {orderReference:54636465456165465,orderStatus:"已签收"},
		// {orderReference:54636465456165465,orderStatus:"已签收"},
	],
	// storeList:[
	// 	{newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,image:'my_ce'},
	// ],
};
const onLoad = function (self) {
	//接收上一个页面状态
	const nickname = self.data.nickname;
	const userId = self.data.userId;
	self.setData({
		nickname: nickname,
		userId: userId,
	})
	//动态修改导航栏名称 
	wx.setNavigationBarTitle({
		title: nickname,
	})
	self.getData();
	self.getDataPage()
	self.getNowDate();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function () {
		const self = this;
		const userId = self.data.userId;
		// 客户详情
		User.getClientDetail(self, {
			userId: userId,
		}).then((ret) => {
			self.setData({
				clientInfo: ret.data,
			})
		}, (err) => {
			console.log("获取失败");
		});
	},
	getDataPage: function () {
		const self = this;
		const userId = self.data.userId;
		// 客户详情 — 地址
		User.getClientAddress(self, {
			page: self.data.page,
			pageSize: 20,
			userId: userId,
		}).then((ret) => {
			if (self.data.page == 1) {
				self.setData({
					addressList: ret.data.list
				});
			} else {
				self.setData({
					addressList: self.data.customerList.concat(ret.data.list)
				});
			}
		}, (err) => {
			console.log("获取失败");
		});
		// 客户详情 — 订单
		User.getClientOrder(self, {
			page: self.data.page,
			pageSize: 20,
			userId: userId,
		}).then((ret) => {
			if (self.data.page == 1) {
				self.setData({
					orderList: ret.data.list
				});
			} else {
				self.setData({
					orderList: self.data.orderList.concat(ret.data.list)
				});
			}
		}, (err) => {
			console.log("获取失败");
		});
	},
	//判断订单状态
	// getOrderStatus:function(){
	// 	const self = this;
	// 	const orderList = self.data.orderList;
	// 	console.log(123456789,orderList);
	// },
	//获取当前月
	getNowDate: function () {
		const self = this;
		const date = new Date(); //得到当前日期原始模式
		const newMonth = date.getMonth() + 1;
		const nowMonth = self.data.nowMonth;
		self.setData({
			nowMonth: newMonth
		});
	},
	// 跳转到客户足迹
	onCusFootmarkTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/me/customerFootmark',
			param: {
				userId: self.data.userId
			}
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