// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Store = require('../../service/Store.js');

let data = {
	signInfo: {}

};

const onLoad = function (self) {
	const userInfo = _g.getLS(_c.LSKeys.userInfo);
	self.setData({
		userInfo: userInfo
	})
	self.getData();
}

const onShow = function (self) { }

const onReady = function (self) {

}

const onUnload = function (self) {

}

const methods = {
	getData: function () {
		let self = this;
		self.taskSignHome();
		// self.listTaskCenter();
	},
	taskSignHome: function () {
		let self = this;
		Store.taskSignHome(self, {
			miniUserId: self.data.userInfo.id
		}).then((ret) => {
			self.setData({
				signInfo: ret.data
			})
		}, (err) => {
		});
	},
	listTaskCenter: function () {
		let self = this;
		Store.listTaskCenter(self, {}).then((ret) => {
			let data = ret.data
			self.setData({
				newbieTask: data.newbieTask,
				dailyTask: data.dailyTask
			})
		}, (err) => {
		});
	},
	taskSignIn: function () {
		let self = this;
		const userInfo = _g.getLS(_c.LSKeys.userInfo);
		Store.taskSignIn(self, {
			miniUserId: userInfo.id
		}).then((ret) => {
			self.getData();
			_g.navigateTo({
				url: 'pages/shop/signFinish',
				param: {
					point: ret.data
				}
			}, self)
		}, (err) => {
		});
	},

	onCodeTap: function () {
		let self = this;
		self.taskSignIn();
	},
	onGoTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/me/blissDetail',
		}, self)
	},
	onSkipTap: function (e) {
		let self = this;
		let code = e.target.dataset.code;
		switch (code) {
			case 11: // 绑定微信
				_g.navigateTo({
					url: 'pages/me/bindingWeChat'
				}, self)
				break;
			case 12: // 绑定手机号
				_g.navigateTo({
					url: 'pages/me/bindingPhone'
				}, self)
				break;
			case 13: // 绑定门店
				// _g.navigateTo({
				// 	url: 'pages/me/bindingWeChat'
				// },self)
				break;
			case 14: //绑定上级
				_g.switchTab({
					url: 'pages/me/index'
				}, self)
				break;
			case 15: //购买权益卡
				_g.navigateTo({
					url: 'pages/card/card'
				}, self)
				break;
			case 21: // 养乐步任务
				_g.switchTab({
					url: 'pages/step/index'
				}, self)
				break;
			case 22: //到店签到
				_g.navigateTo({
					url: 'pages/shop/sign'
				}, self)
				break;
			case 23: //浏览商品
				_g.switchTab({
					url: 'pages/store/store'
				}, self)
				break;
			case 24: //分享商品
				_g.switchTab({
					url: 'pages/store/store'
				}, self)
				break;
			default:
				break;
		}
	},
	onGameTap: function () {
		let self = this;
		// _g.navigateTo({
		// 	url: 'pages/game/blessTurnTable',
		// }, self)
	},
	onSkipTap: function () {
		let self = this;
		// _g.navigateTo({
		// 	url: 'pages/game/breakEgg',
		// }, self)
	},
}

const temps = {}

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