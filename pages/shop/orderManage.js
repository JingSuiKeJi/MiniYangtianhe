// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	storeId:1,//接收上一页门店id，1为测试数据
	menuList:[
		{status:"WAIT_CHECK",currentId:0},
		{status:"TRADE_BUYER_SIGNED",currentId:1},
		{status:"EXPIRED",currentId:2}
	],
	currentCheck: 0,
	orderList:[
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// 	{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00},
		// ],
		// orderReference:54636465456165465,store:"自提",orderStatus:"待核销",flagId:1},
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// ],
		// orderReference:54636465456165465,store:"配送",orderStatus:"待核销",flagId:1},
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// 	{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00},
		// ],
		// orderReference:54636465456165465,store:"自提",orderStatus:"已核销",flagId:2},
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// 	{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00}
		// ],
		// orderReference:54636465456165465,store:"配送",orderStatus:"已核销",flagId:2},
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// ],
		// orderReference:54636465456165465,store:"自提",orderStatus:"已过期",flagId:3},
		// {storeList:[
		// 	{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		// ],
		// orderReference:54636465456165465,store:"配送",orderStatus:"已过期",flagId:3},
	],
	currentState:'WAIT_CHECK',//订单列表状态，默认待核销
};
const onLoad = function(self) {
	//接收上一个页面状态
	const storeId = self.data.storeId;
	self.setData({
		storeId:storeId,
	});
	self.getDataPage();
};
const onShow = function(self) {
	
};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	getDataPage:function(){
		const self = this;
		const storeId = self.data.storeId;
		const currentState = self.data.currentState;
		//门店店员列表
		User.getOrderList(self, {
			page: self.data.page,
			pageSize: 10,
			storeId:storeId,
			status:currentState,
		}).then((ret) => {
			if (self.data.page == 1) {
	    		self.setData({
	    			orderList: ret.data.list
	    		});
			} else {
				self.setData({
	    			orderList: self.data.orderList.concat(ret.data.list)
	    		});
			}
		},(err) => {
	        console.log("获取失败");
	   });
	},
	//选择列表
	chooseMenu:function(options){
		let self = this;
		//当前选择
		const id = options.currentTarget.dataset.id;
		//列表
		const menuList = self.data.menuList;
		//当前列表名
		const currentState = menuList[id].status;
		//设置当前样式
		self.setData({
			currentCheck:id,
			currentState:currentState
		});
		self.getDataPage()
	},
	//点击跳转到订单详情页
	onOrderVerifyDetailTap:function(e){
		let self = this;
		const orderList = self.data.orderList;
		const idx = e.target.dataset.idx;
		// console.log(123,orderList[idx].orderId);
	    _g.navigateTo({
			param:{
          		orderId:orderList[idx].orderId
         	},
	        url: 'pages/order/orderVerifyDetail',
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