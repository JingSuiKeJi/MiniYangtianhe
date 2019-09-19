// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {
	selectLevel: 1,//1一级客户/2二级客户
};
const onLoad = function (self) {
	self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function () {
		let self = this;
		self.getPageData();
	},
	getPageData: function () {
		let self = this;
		User.getClientList(self, {
			page: self.data.page,
			pageSize: 10,
			level: self.data.selectLevel
		}).then((ret) => {
			self.setData({
				clientList: ret.data.list,
				hasNextPage: ret.data.hasNextPage
			})
		}, (err) => {

		});
	},
	onLevelTap: function (e) {
		const self = this;
		self.setData({
			selectLevel: Number(e.target.dataset.level)
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