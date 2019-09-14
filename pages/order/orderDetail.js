// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	orderStatus:'交易成功',//存储上一个页面状态，默认评价成功
	storeList:[],
	orderInfoList:[
		{number:'54636465456165465',creationTime:'2019-01-25  14:30',paymentTime:'2019-01-25  14:30'}
	],
	takeState:'自提',//自提或者配送,默认配送
	orderDistribution:[
		{title:'配送信息',storeTitle:'配送地址',store:'天河区天盈广场东塔3004周（先生）13456783456',indataTitle:'配送时间',indata:'2019/07/01 16:00-17:00',addressTitle:'店铺地址',address:'花城大道店  珠江新城花城大道88号'}
	],
	startTime:'3599',//一小时(单位/秒)
	minutes:'',//当前分钟
	seconds:'',//当前秒数
	showModal:false,//取消订单弹窗
	showLogistics:false,//查看物流弹窗
	confirmReceipt:false,//确认收货
	deliveryStatus:[//物流状态
		{where:'您的快件已到达天河区',momentData:'2019-07-25',momentTime:'9:20',arrive:true},
		{where:'您的订单在广州分拣中心发货完成，准备送往天河区花城大道',momentData:'2019-07-25',momentTime:'9:20'},
		{where:'您的订单已经确认完毕',momentData:'2019-07-25',momentTime:'9:20'},
		{where:'您提交了订单，等待系统确认',momentData:'2019-07-25',momentTime:'9:20'},
	],
	
};
const onLoad = function(self) {
	//订单有效时间倒计时
	self.downStartTime()
	//接收上一个页面状态
	self.setData({
		orderStatus:self.data.orderStatus,
		orderId: self.data.orderId
	});
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function () {
	   let self = this;	
	   self.myOrderDetail();
	},
    myOrderDetail: function () {
		const self = this;
        Order.myOrderDetail(self, {
            orderId: self.data.orderId
        }).then((ret) => {
			let data = ret.data;
			self.setData({
				orderAddress: data.orderAddress,
				storeList: data.goodsList,
				deliveryFee: data.deliveryFee,
				pointsDeduction: data.pointsDeduction,
				payment: data.payment,
				orderNo: data.orderNo,
				creatrTime: data.creatrTime,
				payTime: data.payTime,
				orderDelivery: data.orderDelivery,
				deliveryType: data.deliveryType//配送方式：1.快递 2.门店自提 3.立即配送 4.预约配送
			});
        }, (err) => {
        });
	},
	//订单支付倒计时
	downStartTime:function () {
		let self = this;
		let startTime = self.data.startTime;
		const timer = setInterval(function(){
			self.setData({
				startTime: startTime-1
			});
			self.downStartTime();
			clearTimeout(timer);
		},1000)
		const minutes = parseInt(startTime%3600/60);//剩余分钟数
		self.setData({
			minutes:minutes
		})
		const seconds = startTime%60;//剩余秒数
		self.setData({
			seconds:seconds
		})
		if (startTime == 0) {
			clearTimeout(timer);
			// wx.navigateBack()
			return
		}
	},
	//支付
	onPayMoneyTap:function(){
		// wx.requestPayment({
		// 	'timeStamp':self.data.timeStamp,
		// 	'nonceStr': self.data.nonceStr,
		// 	'package': 'prepay_id='+self.data.prepay_id,
		// 	'signType': 'MD5',
		// 	'paySign': self.data._paySignjs,
		// 	'success':function(res){
		// 		console.log(res);
		// 	},
		// 	'fail':function(res){
		// 		console.log('fail:'+JSON.stringify(res));
		// 	}
		// })
	},
	//取消订单操作和模态框
	showDialogBtn: function () {
		let self = this;
		self.setData({
		  showModal: true
		})
	},
	hideModal: function () {
		let self = this;
		self.setData({
		  showModal: false
		});
	},
	onCancel: function () {
		let self = this;
		self.hideModal();
	},
	onConfirm: function () {
		let self = this;
		const orderStatus = '交易关闭';
		_g.navigateTo({
			param:{
		    	orderStatus:orderStatus
		    },
			url: 'pages/order/orderDetail',
		}, self);
		self.hideModal();
	},
	//查看物流
	onCheckLogisticsTap:function(){
		let self = this;
		self.setData({
		  showLogistics: true
		});
	},
	onHideLogisticsTap: function () {
		let self = this;
		self.setData({
		  showLogistics: false
		});
	},
	onCancelLogisticsTap: function () {
		let self = this;
		self.onHideLogisticsTap();
	},
	//确认收货
	onConfirmReceiptTap: function () {
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
	onConfirmConfirmReceipt: function () {
		let self = this;
		wx.showToast({
			mask:true,
			title: '收货成功',
			icon: 'success',
			duration: 1000,
			success:function(){
				setTimeout(function () {
					//延时跳转到交易成功
					const orderStatus = '交易成功';
					_g.navigateTo({
						param:{
					    	orderStatus:orderStatus
					    },
						url: 'pages/order/orderDetail',
					}, self);
				}, 1000) //延迟时间
			}
		})
		setTimeout(function(){
		  wx.hideToast()
		},1000)
		self.hideConfirmReceipt();
	},
	//删除订单
	onDeleteTap:function(){
		
	},
	//申请售后
	onApplyafterSaleTap:function(){
		let self = this;
		const takeState = self.data.takeState;
		_g.navigateTo({
			param:{
				takeState:takeState
			},
			url: 'pages/order/applyAfter',
		}, self);
	},
	//提醒发货
	onAlertTap:function () {
	},
	//发表评论
	onPostCommentTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/postComment',
			param: {
				orderId: self.data.orderId,
				goodsId: self.getGoodsId()
			}
		}, self);
	},
	//查看评论
	onCheckCommentTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/myComment',
		}, self);
	},
	//跳转到申请售后
	onApplyAfterSales:function(){
		let self = this;
		const orderStatus = self.data.orderStatus;
		_g.navigateTo({
			param:{
				orderStatus:orderStatus
			},
			url: 'pages/order/applyAfter',
		}, self);
	},
	getGoodsId: function () {
		var self = this;
		let goodsId = [];
		let list = self.data.storeList;
		if (list.length>1) {
			list.forEach(element => {
			   goodsId.push(element.goodsId);
			});
			return goodsId.join(',');
		}else {
			return list[0].goodsId;
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