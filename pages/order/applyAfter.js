// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	orderStatus:'',//上一个页面订单状态
	takeState:'',//上一个页面在状态，自提/配送
	storeList:[],//商品列表
	
};
const onLoad = function(self) {
	//接收上一个页面状态
	const takeState = self.data.takeState;
	self.setData({
		orderId: self.data.orderId,
		takeState:takeState
	});
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function () {
		let self = this;
        self.getAfterSale()
	},
    getAfterSale() {
        const self = this;
        Order.getAfterSale(self, {
            orderId: self.data.orderId
        }).then((ret) => {
			let data = ret.data;
			let goodsVoList = data.goodsVoList
			// _.each(goodsVoList,(item)=> item.select = false);
			self.setData({
				storeList: goodsVoList,
				refundSwich: data.refundSwich,
				salesReturnSwich: data.salesReturnSwich,
				// exchangeGoodsSwich: data.exchangeGoodsSwich,
			})
        }, (err) => {

        });
	},
	// 选择退款商品
	onSelectTap:function(options){
		let self = this;
		let storeList = self.data.storeList;
		let index = options.currentTarget.dataset.index;
		storeList[index].select = !storeList[index].select;
		self.setData({
			storeList:storeList
		})
	},
	//跳转到申请退款
	onRefundTap:function(e){
		let self = this;
		let orderItemIds = self.chooseIds();
		console.log(33, e.currentTarget.dataset.type)
		if (!orderItemIds.length) {
			_g.toast({
				title: '请选择商品'
			});
			return
		}
		_g.navigateTo({
			param:{
				orderItemIds: orderItemIds.join(','),
				type: Number(e.currentTarget.dataset.type)
			},
			url: 'pages/order/applyRefund',
		}, self);
	},
	// //跳转到申请退款退货
	// onRefundGoodsTap:function(){
	// 	let self = this;
	// 	let orderItemIds = self.chooseIds();
	// 	if (!orderItemIds.length) {
	// 		_g.toast({
	// 			title: '请选择商品'
	// 		});
	// 		return
	// 	}
	// 	_g.navigateTo({
	// 		param:{
	// 			orderItemIds: orderItemIds.join(',')
	// 		},
	// 		url: 'pages/order/applyRefund',
	// 	}, self);
	// },
	//跳转到申请换货
	onExchangeGoodsTap:function(){
		let self = this;
		_g.navigateTo({
			param:{
				status:'申请换货'
			},
			url: 'pages/order/applyRefund',
		}, self);
	},
	chooseIds: function () {
		const self = this;
		let ids = []
		_.each(self.data.storeList,(item)=> {
            if (item.select) ids.push(item.orderItemId);
		})
		return ids;
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