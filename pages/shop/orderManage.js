// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Order = require('../../service/Order');
let data = {
	storeId: 1,//接收上一页门店id，1为测试数据
	menuList: [
		{ status: "待核销", currentId: 1 },
		{ status: "已签收", currentId: 2 },
		{ status: "已过期", currentId: 3 },
		// {status:"售后审核",currentId:4}
	],
	currentCheck: 1,
	list: [],
};
const onLoad = function (self) {
	let userInfo = _g.getLS(_c.LSKeys.userInfo);
	if (userInfo.verifier.level == 1) {
		let menuList = self.data.menuList;
		menuList.push({ status: "售后审核", currentId: 4 });
		self.setData({ menuList })
	}
	self.getDataPage();
};
const onShow = function (self) {

};
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	getDataPage: function () {
		const self = this;
		const storeId = self.data.storeId;
		//门店店员列表
		User.getOrderList(self, {
			page: self.data.page,
			pageSize: 20,
			storeId: storeId,
			status: self.data.currentCheck,
		}).then((ret) => {
			if (self.data.page == 1) {
				self.setData({
					list: ret.data.list
				});
			} else {
				self.setData({
					list: self.data.list.concat(ret.data.list)
				});
			}
		}, (err) => {
		});
	},
	getOrderAfterSaleList: function () {
		const self = this;
		Order.getOrderAfterSaleList(self, {}).then((ret) => {
			self.setData({
				list: ret.data.list
			});
		}, (err) => {
		});
	},
	//选择列表
	chooseMenu: function (options) {
		let self = this;
		const id = options.currentTarget.dataset.id;
		if (id == self.data.currentCheck) return;
		self.setData({
			currentCheck: id,
		});
		if (id != 4) {
			self.getDataPage()
		} else {
			self.getOrderAfterSaleList();
		}

	},
	//点击跳转到订单详情页
	onOrderVerifyDetailTap: function (e) {
		let self = this;
		const list = self.data.list;
		const idx = e.target.dataset.idx;
		if (self.data.currentCheck == 4) {
			_g.navigateTo({
				param: {
					orderId: list[idx].orderId
				},
				url: 'pages/order/afterSaleDetail',
			}, self);
		} else {
			_g.navigateTo({
				param: {
					orderId: list[idx].orderId
				},
				url: 'pages/order/orderVerifyDetail',
			}, self);
		}

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