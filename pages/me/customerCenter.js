// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	userId:'客户中心',//上个页面用户id,默认客户中心
	addressSet:false,//是否设置地址
	orderList:[
		{orderReference:54636465456165465,orderStatus:"已签收"},
		{orderReference:54636465456165465,orderStatus:"已签收"},
	],
	storeList:[
		{newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,image:'my_ce'},
	],
};
const onLoad = function(self) {
	//接收上一个页面状态
	const userId = self.data.userId;
	self.setData({
		userId:userId
	})
	//动态修改导航栏名称 
	wx.setNavigationBarTitle({
		title: userId,
	}) 
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	// 跳转到客户足迹
	onCusFootmarkTap:function(){
		 let self = this;
	    _g.navigateTo({
	        url: 'pages/me/customerFootmark',
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