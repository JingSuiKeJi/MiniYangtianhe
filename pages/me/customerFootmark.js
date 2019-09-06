// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	dayStyle: [
      {month: 'current', day: new Date().getDate(), color: '#333333', background: 'rgba(255,255,255,0)'},
      {month: 'current', day: new Date().getDate(), color: '#FFFFFF', background: '#1DC4BC'}
    ],
	dateList:[
		{date:'8月7号'},
		{date:'8月6号'}
	],
	imgAndPriceList:[
		{img:'my_herbalJelly',price:5.8},
		{img:'my_herbalJelly',price:5.8},
		{img:'my_herbalJelly',price:5.8},
		{img:'my_herbalJelly',price:5.8},
		{img:'my_herbalJelly',price:5.8},
		{img:'my_herbalJelly',price:5.8},
	],
	showAndHideCheck:false,//check框显隐
	slectAllIcon:false,//
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//给点击的日期设置一个背景颜色
	dayClick: function (event) {
		let self = this;
		let clickDay = event.detail.day;
		let changeBgColor = `dayStyle[0].color`;
		let changeBg = `dayStyle[0].background`;
		let changeDay = `dayStyle[1].day`;
		let changeEndBg = `dayStyle[1].background`;
		self.setData({
			[changeDay]: clickDay,
			[changeBg]:"rgba(255,255,255,0)",
			[changeBgColor]:"black",
			[changeEndBg]: "#1DC4BC"
		})
	},
	//显示隐藏check
	onCancelSwitchTap:function(){
		let self = this;
		self.setData({
			showAndHideCheck:true
		})
	},
	//全选check
	onSelectAllIcontap:function(){
		let self = this;
		const slectAllIcon = !self.data.slectAllIcon;
		self.setData({
			slectAllIcon:slectAllIcon
		})
	},
	//删除选中
	onDeleteTap:function(){
		let self = this;
		self.setData({
			showAndHideCheck:false
		})
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