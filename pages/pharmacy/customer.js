// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	selectLevel:1,//1一级客户/2二级客户
	customer:[
		{avatar:1,name:'命运的杰克',orderNum:257,money:2335,selectLevel:1},
		{avatar:2,name:'命运的杰克',orderNum:257,money:2335,selectLevel:1},
		{avatar:3,name:'命运的杰克',orderNum:257,money:2335,selectLevel:1},
		{avatar:4,name:'命运的杰克',orderNum:257,money:2335,selectLevel:1},
		{avatar:5,name:'命运的杰克',orderNum:257,money:2335,selectLevel:1},
		{avatar:6,name:'杰克的命运',orderNum:257,money:2335,selectLevel:2},
		{avatar:7,name:'杰克的命运',orderNum:257,money:2335,selectLevel:2},
		{avatar:8,name:'杰克的命运',orderNum:257,money:2335,selectLevel:2},
		{avatar:9,name:'杰克的命运',orderNum:257,money:2335,selectLevel:2},
	]
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	// 切换到一级页面
	onLevelOneTap:function(){
		const self = this;
		const selectLevel = self.data.selectLevel;
		self.setData({
			selectLevel:1
		})
	},
	//切换到二级页面
	onLevelTwoTap:function(){
		const self = this;
		const selectLevel = self.data.selectLevel;
		self.setData({
			selectLevel:2
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