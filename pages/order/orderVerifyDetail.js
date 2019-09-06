// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	storeList:[
		{newsImg:'my_ce',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:'99.00'},
		{newsImg:'my_antiviral',newsName:"抗病毒口服液",newsWeight:"10gx12支",newsMoney:'23.80'},
	],
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {}

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