// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	menuList: [
		{ name: "全部", currentId: 0 },
		{ name: "待付款", currentId: 1 },
		{ name: "待发货", currentId: 2 },
		{ name: "待收货", currentId: 3 },
		{ name: "已签收", currentId: 4 }
	],
	currentCheck: 0,//默认显示全部
	showModal: false,
	orderList: [],
};
const onLoad = function (self) {
	//接收上一个页面状态
	const currentCheck = self.data.currentCheck;
	self.setData({
		currentCheck: currentCheck
	});
	self.getData();

};
const onShow = function (self) {

};
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	getData: function () {
		let self = this;
        self.getPageData();
	},
	getPageData: function (value) {
		let self = this;
		let param = {
			page: self.data.page,
			pageSize: 15,
			type: self.data.currentCheck + 1,//1.全部 2.待付款 3.待发货 4.代收贷 5.已签收 
		}
		if (value) {
			param.orderNo = value
		}
		Order.myOrderList(self, param).then((ret) => {
			let data = ret.data;
			self.setData({
				orderList: data.list,
				hasNextPage: data.hasNextPage
			})
        }, (err) => {

        });
	},
    prePay(orderId) {
        const self = this;
        Order.prePay(self, {
            orderId: self.data.orderId
        }).then((ret) => {
			ret.data.package = ret.data.package.replace(/\s*/g,'');
            let payInfo = ret.data;
            payInfo.success = function() {
                //TODO check pay status
                _g.showModal({
                    title: '提示',
                    content: '支付成功',
                    confirm: function() {
                        self.payStatus();
                    }
                });
            };
            payInfo.fail = function() {
                _g.showModal({
                    title: '提示',
                    content: '支付失败',
                });
            };
            _g.requestPayment(payInfo);

        }, (err) => {
        	_g.showModal({
                title: '提示',
                content: '支付失败',
            });
        });
	},
	payStatus() {
		const self = this;
		_g.redirectTo({
			url: 'pages/order/orderDetail',
			param: {
				orderId: self.data.orderId,
				index: 0,
				from: 'index'
			}
		}, self);

	},
	cancelOrder: function () {
		const self = this;
        Order.cancelOrder(self, {
            orderId: self.data.orderId
        }).then((ret) => {
			self.redirectTo('交易关闭');
        }, (err) => {
        });
	},
	confirmOrder: function () {
		const self = this;
        Order.confirmOrder(self, {
            orderId: self.data.orderId
        }).then((ret) => {
			_g.toast({
				title: '收货成功',
			    icon: 'success',
			})
			self.redirectTo('交易关闭');
        }, (err) => {
        });
	},
	//选择菜单状态
	chooseMenu: function (options) {
		let self = this;
		const id = options.currentTarget.dataset.id;
		self.setData({
			currentCheck: id,
		})
		self.getPageData();
	},
	//跳转到对应的状态页
	onOrderDetailTap: function (options) {
		let self = this;
        _g.navigateTo({
			url: 'pages/order/orderDetail',
			param: {
				orderId: options.currentTarget.dataset.orderid
			}
		}, self);
		// const orderStatus = options.currentTarget.dataset.orderStatus;
		// if (orderStatus == '售后中' || orderStatus == '售后结束' || orderStatus == '已签收') {
		// 	return
		// } else {
		// 	_g.navigateTo({
		// 		param: {
		// 			orderStatus: orderStatus
		// 		},
		// 		url: 'pages/order/orderDetail',
		// 	}, self);
		// }
	},
	//取消订单操作和模态框
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
	onConfirm: function () {
		let self = this;
		const orderStatus = '交易关闭';
		_g.navigateTo({
			param: {
				orderStatus: orderStatus
			},
			url: 'pages/order/orderDetail',
		}, self);
		self.hideModal();
	},
	onCancelTap: function (e) {
		let self = this;
		self.setData({
			orderId: e.currentTarget.dataset.orderid
		})
		_g.showModal({
			title: '',
			content: '确认要取消订单吗',
			showCancel:  true,
            confirmColor: '#FD3D2F',
			cancelColor: '#007AFF',
			confirm() {
				self.cancelOrder()
				
			}
		});
	},
	//提醒发货
	onAlertTap: function () {

	},
	//确认收货
	onConfirmReceiptTap: function (e) {
		let self = this;
		self.setData({
			confirmReceipt: true
		})
	},
	hideConfirmReceipt: function () {
		let self = this;
		self.setData({
			confirmReceipt: false
		});
	},
	onCancelConfirmReceipt: function () {
		let self = this;
		self.hideConfirmReceipt();
	},
	onConfirmTap: function (e) {
		let self = this;
		self.setData({
			orderId: e.currentTarget.dataset.orderid 
		})
		_g.showModal({
			title: '',
			content: '确认已收到商品吗',
			showCancel:  true,
            confirmColor: '#FD3D2F',
			cancelColor: '#007AFF',
			confirm() {
				self.confirmOrder();
				
			}
		});	
	},
	onConfirmConfirmReceipt: function () {
		let self = this;
		wx.showToast({
			mask: true,
			title: '收货成功',
			icon: 'success',
			duration: 1000,
			success: function () {
				setTimeout(function () {
					//延时跳转到交易成功
					const orderStatus = '交易成功';
					_g.navigateTo({
						param: {
							orderStatus: orderStatus
						},
						url: 'pages/order/orderDetail',
					}, self);
				}, 400) //延迟时间
			}
		})
		setTimeout(function () {
			wx.hideToast()
		}, 1000)
		self.hideConfirmReceipt();
	},
	//发表评论
	onPostCommentTap: function (e) {
		let self = this;
		let index = e.currentTarget.dataset.index;
		_g.navigateTo({
			url: 'pages/order/postComment',
			param: {
				orderId: self.data.orderList[index].orderId,
				goodsId: self.getGoodsId(self.data.orderList[index].goodsList),
			}
		}, self);
	},
	getGoodsId: function (arr) {
		var self = this;
		let goodsId = [];
		if (arr.length>1) {
			arr.forEach(element => {
			   goodsId.push(element.goodsId);
			});
			return goodsId.join(',');
		}else {
			return arr[0].goodsId;
		}
	},
	onPayTap: function (e) {
		let self = this;
		self.setData({
			orderId: e.currentTarget.dataset.orderid
		})
		self.prePay();
	},
	onInputTap: function (e) {
		let self = this;
		self.getPageData(e.detail.value);
	},
	redirectTo : function (orderStatus) {
		let self = this;
		_g.redirectTo({
			url: 'pages/order/orderDetail',
			param: {
				orderId: self.data.orderId,
				orderStatus: orderStatus,
				from: 'index'
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