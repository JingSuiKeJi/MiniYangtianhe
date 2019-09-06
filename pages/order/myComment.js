// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	commentList:[
		{date:'2019/07/23',write:'很好，简直不要太棒惹了！',goodsImg:'my_ce',goodsName:'养生堂维C+维E',goodsAmount:'250gx两盒装',price:'99.00',commentStatus:'已好评'},
		{date:'2019/07/23',write:'很好，简直不要太棒惹了！',goodsImg:'my_ce',goodsName:'养生堂维C+维E',goodsAmount:'250gx两盒装',price:'99.00',commentStatus:'已中评'},
		{date:'2019/07/23',write:'很好，简直不要太棒惹了！',goodsImg:'my_ce',goodsName:'养生堂维C+维E',goodsAmount:'250gx两盒装',price:'99.00',commentStatus:'已差评'},
		{date:'2019/07/23',write:'很好，简直不要太棒惹了！',commentImage:[{img:'my_tea'},{img:'my_tea'},{img:'my_tea'}],goodsImg:'my_ce',goodsName:'养生堂维C+维E',goodsAmount:'250gx两盒装',price:'99.00',commentStatus:'已差评'},
	]
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	
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