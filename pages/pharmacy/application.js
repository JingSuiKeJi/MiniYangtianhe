// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {
	showModal: false,
	value: '',
	fee: 0,
};
const onLoad = function (self) {
	self.setData({
		value: self.data.money,
		realMoney:self.data.money 
	});
	self.getData();
};
const onShow = function (self) { };
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	getData: function () {
		let self = this;
		self.getPageData();
	},
    apply: function () {
		let self = this;
		if (!self.data.money) {
			_g.toast({
				title: '请输入提现金额'
			});
			return false;
		}
		User.apply(self, {
			money: self.data.money
        }).then((ret) => {
			_g.navigateTo({
				url: 'pages/pharmacy/submitResults',
				param: {
					withdrawId: ret.data.id
				}
			}, self);
        }, (err) => {
           
        });
	},
	count: function () {
		let self = this;
		User.count(self, {
			money: self.data.money
        }).then((ret) => {
            self.setData({
				fee: ret.data.fee,
				realMoney: ret.data.realMoney
			})
        }, (err) => {
           
        });
	},
	getPageData: function () {
		let self = this;
		User.withdrawRecordList(self, {
			page: self.data.page,
			pageSize: 10,
        }).then((ret) => {
            self.setData({
				recordList: ret.data.list,
				hasNextPage: ret.data.hasNextPage
			})
        }, (err) => {
           
        });
	},
	bindMoneyChange: function (e) {
		let self = this;
		this.setData({
			money: e.detail.value
		})
		self.count();
	},
	showDialogBtn: function () {
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
	//提现等待成功后回调
	onConfirm: function () {
		let self = this;
		this.hideModal();
		wx.showLoading({
			title: '提交中',
			duration: 1500,
			success: function () {
				self.apply();
			}
		});
		setTimeout(function () {
			wx.hideLoading()
		}, 2000);
	},
	onAllTap: function (e) {
		let self = this;
		self.setData({
			money: self.data.value
		});
		self.count();
		
	}
};

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