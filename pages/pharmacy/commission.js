// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	withdrawlist:[
		{createTime:"2019.07.01",money:"+1500.00",type:"自购佣金"},
		{createTime:"2019.07.01",money:"+10.00",type:"一级佣金"},
		{createTime:"2019.07.01",money:"-5000.00",type:"提现"},
		{createTime:"2019.07.01",money:"+5.00",type:"二级佣金"},
		{createTime:"2019.07.01",money:"+50.00",type:"二级佣金"}
	]
};
const onLoad = function(self) {};
const onShow = function(self) {};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {};

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