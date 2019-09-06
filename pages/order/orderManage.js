// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	menuList:[
		{name:"待核销",currentId:0},
		{name:"已核销",currentId:1},
		{name:"已过期",currentId:2}
	],
	currentCheck: 0,
	orderList:[
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
			{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00},
		],
		orderReference:54636465456165465,store:"自提",orderStatus:"待核销",flagId:1},
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		],
		orderReference:54636465456165465,store:"配送",orderStatus:"待核销",flagId:1},
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
			{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00},
		],
		orderReference:54636465456165465,store:"自提",orderStatus:"已核销",flagId:2},
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
			{newsImg:'my_herbalJelly',newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00}
		],
		orderReference:54636465456165465,store:"配送",orderStatus:"已核销",flagId:2},
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		],
		orderReference:54636465456165465,store:"自提",orderStatus:"已过期",flagId:3},
		{storeList:[
			{newsImg:'e_c',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00},
		],
		orderReference:54636465456165465,store:"配送",orderStatus:"已过期",flagId:3},
	],
	currentState:'待核销'
};
const onLoad = function(self) {
	
};
const onShow = function(self) {
	
};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	//选择列表
	chooseMenu:function(options){
		let self = this;
		//当前选择
		const id = options.currentTarget.dataset.id;
		//列表
		const menuList = self.data.menuList;
		//当前列表名
		const currentState = menuList[id].name;
		//设置当前样式
		self.setData({
			currentCheck:id,
			currentState:currentState
		})
	},
	//跳转到核销订单详情
	onOrderVerifyDetailTap:function(){
		let self = this;
	    _g.navigateTo({
// 			param:{
//           		currentState:self.data.currentState
//          	},
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