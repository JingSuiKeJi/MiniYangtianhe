// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
// const User = require('../../service/User');
const Platfrom = require('../../service/Platfrom');

let data = {
	userInfo:{},//接收上一页用户信息
	qrUrl:'',//二维码地址
};
const onLoad = function(self) {
	//接收上一个页面状态
	const userInfo = self.data.userInfo;
	self.setData({
		userInfo:userInfo,
	});
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData:function(){
		const self = this;
		const storeId = self.data.userInfo.store.id;
		let sence = `p=${_g.getLS(_c.LSKeys.userInfo).promoCode}&s=${storeId}`;
        let path = 'pages/me/blissVerific';
        Platfrom.getShareQR(self, {
            scene: sence,
            page: path
        }).then((ret) => {
            self.setData({
            	qrUrl: ret.data.shareQR
            })
        });
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