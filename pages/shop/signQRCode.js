// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Store = require('../../service/Store.js');

let data = {
	list: []
};
const onLoad = function (self) {
	let userInfo = _g.getUserInfo();
	let url = `${self.data.host}/app/store/getSignQrCode//200/200/${userInfo.id}`;
	self.setData({
		url: url,
		userInfo: userInfo
	});
	self.getData();

}
const onShow = function (self) { }
const onReady = function (self) {

}
const onUnload = function (self) {
}
const methods = {
	getData: function () {
		const self = this;
		self.getPageData();
	},
	getPageData: function () {
		let self = this;
		const userInfo = _g.getLS(_c.LSKeys.userInfo);
		Store.qrCodeCenter(self, {
			page: self.data.page,
			pageSize: 20,
			miniUserId: userInfo.id
		}).then((ret) => {
			let data = ret.data
			if (self.data.page == 1) {
				self.setData({
					list: data.signRecordList.list,
					storeAddress: data.storeAddress,
					storeName: data.storeName,
					storeSignNum: data.storeSignNum,
					hasNextPage: data.signRecordList.hasNextPage
				})
			} else {
				self.setData({
					list: self.data.list.concat(data.signRecordList.list),
					hasNextPage: data.signRecordList.hasNextPage
				})
			}


		}, (err) => {

		});
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