// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	successShare:false,
	getCoupons:false,
	cutPrice:false
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	onSuccessShareTap:function(){
		const self = this;
		const successShare = !self.data.successShare;
		self.setData({
		  successShare: successShare
		});
	},
	onGetCouponsTap:function(){
		const self = this;
		const getCoupons = !self.data.getCoupons;
		self.setData({
		  getCoupons: getCoupons
		});
	},
	onCutPriceTap:function(){
		const self = this;
		const cutPrice = !self.data.cutPrice;
		self.setData({
		  cutPrice: cutPrice
		});
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