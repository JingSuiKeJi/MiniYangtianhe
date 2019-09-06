// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	orderStatus:'',//上一个页面订单状态
	takeState:'',//上一个页面在状态，自提/配送
	storeList:[//商品列表
		{newsImg:'my_ce',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:'99.00',select:false,id:'0'},
		{newsImg:'my_antiviral',newsName:"抗病毒口服液",newsWeight:"10gx12支",newsMoney:'23.80',select:false,id:'1'},
	],
};
const onLoad = function(self) {
	//接收上一个页面状态
	const orderStatus = self.data.orderStatus;
	const takeState = self.data.takeState;
	self.setData({
		orderStatus:orderStatus,
		takeState:takeState
	})
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	// 选择退款商品
	onSelectTap:function(options){
		let self = this;
		//获取索引
		const id = options.currentTarget.dataset.id;
		//获取列表
		const storeList = self.data.storeList;
		for(var i=0;i<storeList.length;i++){
			if(storeList[i].id == id){
				storeList[i].select = !storeList[i].select; //当前点击的位置为true即选中
			}
		}
		self.setData({
			storeList:storeList
		})
	},
	//跳转到申请退款
	onRefundTap:function(){
		let self = this;
		_g.navigateTo({
			param:{
				status:'申请退款'
			},
			url: 'pages/order/applyRefund',
		}, self);
	},
	//跳转到申请退款退货
	onRefundGoodsTap:function(){
		let self = this;
		_g.navigateTo({
			param:{
				status:'申请退货'
			},
			url: 'pages/order/applyRefund',
		}, self);
	},
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