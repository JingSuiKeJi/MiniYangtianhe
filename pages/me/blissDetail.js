// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	withdrawlist:[
		{createTime:"2019.07.01",money:"+50",type:"养步任务"},
		{createTime:"2019.07.01",money:"+5",type:"养步任务"},
		{createTime:"2019.07.01",money:"-50",type:"抵扣商品"},
		{createTime:"2019.07.01",money:"+50",type:"养步任务"},
		{createTime:"2019.07.01",money:"-50",type:"赠送",id:"-ID446688"}
	],
	showModal:false,//充值模态框显影
	showPresentedBtn:false,//赠送模态框显影
};
const onLoad = function(self) {};
const onShow = function(self) {};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	//充值模态框
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
		this.hideModal();
	},
	//赠送模态框
	showPresentedBtn: function () {
		this.setData({
		  showPresentedBtn: true
		})
	},
	hidePresentedModal: function () {
		this.setData({
		  showPresentedBtn: false
		});
	},
	onPresentedCancel: function () {
		this.hidePresentedModal();
	},
	onPresentedConfirm: function () {
		this.hidePresentedModal();
	},
};

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