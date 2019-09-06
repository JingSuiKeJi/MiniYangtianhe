// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	consigneeList:[
		{name:"周周周",tel:"13414775964",address:"广东省广州市天河区天盈广场东塔3004",currentId:0},
		{name:"周周周",tel:"13414775964",address:"广东省广州市天河区天盈广场东塔3004",currentId:1},
		{name:"周周周",tel:"13414775964",address:"广东省广州市天河区天盈广场东塔3004",currentId:2},
	],
	handle:true,//切换管理状态下的背景颜色样式
	currentCheck:0,
	showModal: false,
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//添加收货人
	onAddConsigneeTap:function(){
		 let self = this;
		_g.navigateTo({
		    url: 'pages/me/addConsignee',
		}, self);
	},
	//管理地址
	onHandleTap:function(){
		const self = this;
		const handle = !self.data.handle;
		self.setData({
			handle:handle
		})
	},
	// 选择默认地址
	chooseMenu:function(options){
		const self = this;
		const id = options.currentTarget.dataset.id;
		//设置当前样式
		self.setData({
			currentCheck:id,
		})
	},
	//编辑操作
	onCompileTap: function () {
		 let self = this;
		_g.navigateTo({
		    url: 'pages/me/compileConsignee',
		}, self);
	},
	//删除操作和模态框
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
	// 完成
	onCompleteTap:function(){
		const self = this;
		const handle = !self.data.handle;
		self.setData({
			handle:handle
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