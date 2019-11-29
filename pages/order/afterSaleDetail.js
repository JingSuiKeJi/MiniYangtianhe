// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	orderId: '50',//接收上一页选择的订单id，测试数据50
	orderDetail: [],
};
const onLoad = function (self) {
	//接收上一个页面状态
	const orderId = self.data.orderId;
	self.setData({
		orderId: orderId,
	});
	self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function () {
		const self = this;
		const orderId = self.data.orderId;
		User.getOrderDetail(self, {
			orderId: orderId,
		}).then((ret) => {
			self.setData({
				orderDetail: ret.data
			});
		}, (err) => {
			_g.toast({
				title: err
			})
		});
	},
	//审核通过
	confirmReturn: function () {
		const self = this;
		User.confirmReturn(self, {
			id: self.data.orderDetail.orderAfterSale.id
		}).then((ret) => {
			_g.toast({title: '提交成功'});
            self.getData();
		}, (err) => {

		});
	},
	//审核拒绝
	rejectReturn: function () {
		const self = this;
		User.rejectReturn(self, {
			id: self.data.orderDetail.orderAfterSale.id
		}).then((ret) => {
			_g.toast({title: '提交成功'});
			self.getData();
		}, (err) => {

		});
	},
	onManualVerifyTap: function () {
		const self = this;
		// console.log(self.data.orderDetail.verificationCode)
		_g.showModal({
			title: '核销订单',
			content: '确定手动核销订单？',
			showCancel: true,
			confirm() {
				User.verification(self, {
					virifyCode: self.data.orderDetail.verificationCode,
				}).then((ret) => {
					self.getData();
					_g.toast({
						title: '核销订单成功'
					});
				}, (err) => {
					_g.toast({
						title: '手动核销失败',
						duration: 1000,
					});
				});
			}
		});
	},
	onConfirmTap: function () {
		const self = this;
		if (self.data.orderDetail.orderAfterSale.type == 1) {
			_g.showModal({
				content: '审核通过马上退款给客户？',
				showCancel: true,
				confirmColor: '#1DD3B5',
				confirm: function () {
					self.confirmReturn();
				}
			})
		}

	},
	onRejectTap: function () {
		const self = this;
		self.rejectReturn();
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