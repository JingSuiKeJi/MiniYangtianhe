// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	withdrawlist:[
		{createTime:"2019.07.01",money:"+1500.00",type:"待审核"},
		{createTime:"2019.07.01",money:"+10.00",type:"待审核"},
		{createTime:"2019.07.01",money:"-500000.00",type:"已通过"},
		{createTime:"2019.07.01",money:"+5.00",type:"未通过"}
	],
	money:'',
	showModal: false,
};
const onLoad = function(self) {};
const onShow = function(self) {};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	bindMoneyChange: function (e) {
	    this.setData({
	        money: e.detail.value
	    })
	},
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
	//提现等待成功后回调
	onConfirm: function () {
		this.hideModal();
		wx.showLoading({
			title: '提交中',
			duration:1500,
			success:function(){
				wx.navigateTo({
				    url: '../../pages/pharmacy/submitResults'
				})
			}
		});
		setTimeout(function () {
			wx.hideLoading()
		}, 2000);
	}
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