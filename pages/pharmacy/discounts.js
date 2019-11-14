// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Order = require('../../service/Order')

let data = {
	toBeUsed: true,
	haveBeenUsed: false,
	outOfDate: false,
	BeUsedNum: '',//待使用的优惠券数
	BeenUsedNum: '',//已使用的优惠券数
	outOfDateNum: '',//已过期的优惠券数
	InvalidList: [], // 过期
	waitUseList: [], // 待使用
	usedList: [], // 已使用
	currentIndex: 1,
};
const onLoad = function (self) {
	if (self.data.from ) {
		self.setData({
			from: self.data.from,
			preGodosReqs: self.data.preGodosReqs,
			platformFlag: self.data.platformFlag,
		})
	}
	self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function () {
		let self = this;
		if (self.data.from) {
			Order.goodsCouponList(self, {
				preGodosReqs: self.data.preGodosReqs,
				status: self.data.currentIndex
			}).then((ret) => {
				let data = ret.data.list;
				switch (self.data.currentIndex) {
					case 1:
						self.setData({
							waitUseList: data,
							list: data
						});
						break;
					case 2:
						self.setData({
							usedList: data,
							list: data
						});
						break;
					default:
						self.setData({
							InvalidList: data,
							list: data
						});
						break;
				}


			}, (err) => {

			});

		} else {
			User.getCouponList(self, {
			}).then((ret) => {
				let data = ret.data;
				self.setData({
					InvalidList: data.InvalidList,
					waitUseList: data.waitUseList,
					usedList: data.usedList,
					BeUsedNum: data.waitUseList.length,
					BeenUsedNum: data.usedList.length,
					outOfDateNum: data.InvalidList.length,
				});
			}, (err) => {

			});

		}

	},
	//待使用
	onToBeUsedTap: function () {
		const self = this;
		self.setData({
			toBeUsed: true,
			haveBeenUsed: false,
			outOfDate: false,
			currentIndex: 1,
		})
	},
	//已使用
	onHaveBeenUsedTap: function () {
		const self = this;
		self.setData({
			toBeUsed: false,
			haveBeenUsed: true,
			outOfDate: false,
			currentIndex: 2,
		})
	},
	//已过期
	onOutOfDateTap: function () {
		const self = this;
		self.setData({
			toBeUsed: false,
			haveBeenUsed: false,
			outOfDate: true,
			currentIndex: 3,
		})
	},
	onUseTap: function (e) {
		let self = this;
		let opts = e.currentTarget.dataset;
		if (self.data.from) {
			_g.getPrevPage().setData({
				couponId: Number(e.currentTarget.dataset.id),
				platformFlag: self.data.platformFlag,
			    preGodosReqs: self.data.preGodosReqs,
			});
			event.emit('preferentialPolicies');
			_g.navigateBack();
		}else {
			let param = {};
			if (opts.type <=2) {
				param.platformFlag = 1;
			}else {
				param.platformFlag = 2;
			}
			_g.navigateTo({
				url: 'pages/search/detailList',
				param: param
			},self)
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