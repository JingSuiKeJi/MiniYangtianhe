// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	orderStatus:'提交成功',//存储上一个页面申请售后操作状态//默认提交成功
	status:'申请退款',//默认申请退款//申请退款、申请退货、申请换货
	goodsStatus:'',//储存上个页面商品售后类型状态（仅退款，退货退款 ，换货）
	flagId:'',//存储上一个页面类型
	storeList:[//商品列表
		{newsImg:'my_ce',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:'99.00'},
		{newsImg:'my_antiviral',newsName:"抗病毒口服液",newsWeight:"10gx12支",newsMoney:'23.80'},
	],
	refundList:[//退款商品列表
		{newsImg:'my_ce',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:'99.00'},
	],
	orderInfoList:[//订单信息
		{number:'54636465456165465',creationTime:'2019-01-25  14:30',paymentTime:'2019-01-25  14:30'}
	],
	refundInfoList:[//退款地址信息
		{address:'广州市天河区天盈广场东塔',tel:'联系电话：138001380000',consignee:'周周周'},
	],
	orderPickUp:[//自提信息
		{title:'自提信息',storeTitle:'供货门店',store:'天盈广场店',indataTitle:'订单有效期',indata:'2019/07/01-2019/07/05',addressTitle:'店铺地址',address:'花城大道店  珠江新城花城大道88号'}
	],
	orderDistribution:[//配送信息
		{title:'配送信息',storeTitle:'配送地址',store:'天河区天盈广场东塔3004周（先生）13456783456',indataTitle:'配送时间',indata:'2019/07/01 16:00-17:00',addressTitle:'店铺地址',address:'花城大道店  珠江新城花城大道88号'}
	],
	showModal:false,//取消售后模态框
};
const onLoad = function(self) {
	//接收上一个页面状态
	const orderStatus = self.data.orderStatus;
	const flagId = self.data.flagId;
	const goodsStatus = self.data.goodsStatus;
	const status = self.data.status;
	self.setData({
		orderStatus:orderStatus,
		flagId:flagId,
		goodsStatus:goodsStatus,
		status:status,
	})
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	// 取消售后
	onCancelServiceTap: function () {
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
		const orderStatus = '售后结束';
		_g.navigateTo({
			param:{
		    	orderStatus:orderStatus
		    },
			url: 'pages/order/afterDetails',
		}, self);
		self.hideModal();
	},
	//跳转到申请退款
	onApplyRefundTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/applyRefund',
		}, self);
	},
	//跳转到申请售后
	onAfterApplicationTap:function(){
		let self = this;
		const orderStatus = self.data.orderStatus;
		_g.navigateTo({
			param:{
		    	orderStatus:orderStatus
			},
			url: 'pages/order/applyAfter',
		}, self);
	},
	onCommentTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/postComment',
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