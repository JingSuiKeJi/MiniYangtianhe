// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Withdraw = require('../../service/Withdraw');
// let timer = 0;
let data = {
	showModal: false,
	value: 0,
	fee: 0,
	realMoney: 0,
	money: ''
};
const onLoad = function (self) {
	// self.setData({
	// 	value: self.data.money,
	// 	realMoney:self.data.money 
	// });
	self.getData();
};
const onShow = function (self) {
	self.getData();
};
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	getData: function () {
		let self = this;
		self.getMoney();
		self.getPageData();
	},
	getMoney() {
		const self = this;
		User.getCommissionBaseInfo(self, {}).then(({data})=>{
			self.setData({
				value: data.money,
				money: ''
			});
		});
	},
    apply: function () {
		const self = this;
		const money = self.data.money;
		if (!money) {
			_g.toast({
				title: '请输入提现金额'
			});
			return false;
		}
		Withdraw.apply(self, {
			money: money
        }).then((ret) => {
        	self.setData({
        		money: 0,
        		realMoney: 0,
        		fee: 0
        	});
			_g.navigateTo({
				url: 'pages/pharmacy/submitResults',
				param: {
					withdrawId: ret.data.id,
					money: money
				}
			}, self);
        }, (err) => {
           _g.toast({
				title: '申请提现失败,请重新申请',
				duration: 3000
           })
        });
	},
	count: function () {
		let self = this;
		if (self.data.money) {
			Withdraw.count(self, {
				money: self.data.money || 0
	        }).then((ret) => {
	        	self.setData({
	        		fee: ret.data.fee,
	        		realMoney: ret.data.realMoney
	        	});
	        }, (err) => {
	           self.count();
	        });
		} else {
			self.setData({
        		money: 0,
        		realMoney: 0,
        		fee: 0
        	});
		}
	},
	getPageData: function () {
		let self = this;
		Withdraw.getRecordList(self, {
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
	inputValue(e) {
		const self = this;
		if (e.detail.value >= self.data.value) {
			self.setData({
				money: self.data.money
			});
		} else {
			self.setData({
				money: e.detail.value
			});
		}
		clearInterval(self.data.timer);
		self.data.timer = setTimeout(()=>{
			self.count();
		}, 500);
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
	},
	onRecordTap(e) {
		const self = this;
		_g.navigateTo({
            url: 'pages/pharmacy/applicationDetails',
            param: {
                withdrawId: self.data.recordList[e.currentTarget.dataset.index].id
            }
	    }, self);
	},
	onRuleTap() {
		const self = this;
		_g.navigateTo({
            url: 'pages/home/notice',
            param: {
                urlParam: `type=article&id=withdrawRule`
            }
        }, self);
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