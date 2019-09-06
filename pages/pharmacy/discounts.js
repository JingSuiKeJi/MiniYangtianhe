// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	toBeUsed:true,
	haveBeenUsed:false,
	outOfDate:false,
	currentIndex:'0',
	BeUsedNum:5,
	BeenUsedNum:4,
	outOfDateNum:3,
	discountsList:[
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"288",moneyOff:"599",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"98",moneyOff:"199",couponType:"药房专享",condition:"仅限药房可用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"商城专享",condition:"仅限商城可用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"大神林实惠店专享",condition:"大神林店专用",startTime:"2019-07-31",endTime:"2019-08-02",status:"0"},
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"1"},
		{price:"288",moneyOff:"599",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"1"},
		{price:"98",moneyOff:"199",couponType:"药房专享",condition:"仅限药房可用",startTime:"2019-07-31",endTime:"2019-08-02",status:"1"},
		{price:"25",moneyOff:"99",couponType:"商城专享",condition:"仅限商城可用",startTime:"2019-07-31",endTime:"2019-08-02",status:"1"},
		{price:"25",moneyOff:"99",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"2"},
		{price:"25",moneyOff:"599",couponType:"全场券",condition:"全场通用",startTime:"2019-07-31",endTime:"2019-08-02",status:"2"},
		{price:"25",moneyOff:"199",couponType:"药房专享",condition:"仅限药房可用",startTime:"2019-07-31",endTime:"2019-08-02",status:"2"},
	]
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//待使用
	onToBeUsedTap:function(){
		const self = this;
		self.setData({
			toBeUsed:true,
			haveBeenUsed:false,
			outOfDate:false,
			currentIndex:'0',
		})
	},
	//已使用
	onHaveBeenUsedTap:function(){
		const self = this;
		self.setData({
			toBeUsed:false,
			haveBeenUsed:true,
			outOfDate:false,
			currentIndex:'1',
		})
	},
	//已过期
	onOutOfDateTap:function(){
		const self = this;
		self.setData({
			toBeUsed:false,
			haveBeenUsed:false,
			outOfDate:true,
			currentIndex:'2',
		})
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