// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	menuList:[
		{name:"全部",currentId:0},
		{name:"待付款",currentId:1},
		{name:"待发货",currentId:2},
		{name:"待收货",currentId:3},
		{name:"已签收",currentId:4}
	],
	currentCheck: 0,//默认显示全部
	showModal: false,
	orderList:[
		{orderReference:54636465456165465,store:"药店",orderStatus:"待付款",all:0,flagId:1,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
			{newsImg:"my_weImg",newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00},
		]
		},
		{orderReference:54636465456165465,store:"商城",orderStatus:"待发货",all:0,flagId:2,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"待收货",all:0,flagId:3,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,store:"药房自提",orderStatus:"待核销",all:0,flagId:3,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"已签收",all:0,flagId:4,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"交易关闭",all:0,flagId:0,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"已核销",all:0,flagId:0,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"售后中",all:0,flagId:0,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		},
		{orderReference:54636465456165465,orderStatus:"售后结束",all:0,flagId:0,
		storeList:[
			{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		]
		}
	],
};
const onLoad = function(self) {
	//接收上一个页面状态
	const currentCheck = self.data.currentCheck;
	self.setData({
		currentCheck:currentCheck
	})

};
const onShow = function(self) {
	
};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	//选择菜单状态
	chooseMenu:function(options){
		let self = this;
		//当前选择
		const id = options.currentTarget.dataset.id;
		//列表
		const orderList = self.data.orderList;
		//设置当前样式
		self.setData({
			currentCheck:id,
		})
	},
	//跳转到对应的状态页
	onOrderDetailTap:function(options){
		let self = this;
		const orderStatus = options.currentTarget.dataset.orderStatus;
		if(orderStatus=='售后中'||orderStatus=='售后结束'||orderStatus=='已签收'){
			return
		}else{
			_g.navigateTo({
				param:{
			    	orderStatus:orderStatus
			    },
				url: 'pages/order/orderDetail',
			}, self);
		}
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
			param:{
		    	orderStatus:orderStatus
		    },
			url: 'pages/order/orderDetail',
		}, self);
		self.hideModal();
	},
	//提醒发货
	onAlertTap:function () {
		
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
				}, 400) //延迟时间
			}
		})
		setTimeout(function(){
		  wx.hideToast()
		},1000)
		self.hideConfirmReceipt();
	},
	//发表评论
	onPostCommentTap:function(){
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