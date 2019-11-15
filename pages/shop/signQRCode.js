// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	
};
const onLoad = function(self) {
	let userInfo = _g.getUserInfo(); 
	let url = `/${self.data.host}/200/200/${userInfo.id}`;
	// let url = 'http://120.79.36.152/app/store/getSignQrCode/300/300/55'
	self.setData({
		url: url,
		userInfo: userInfo
	});
	self.getData();
	
}
const onShow = function(self) {}
const onReady = function(self) {

}
const onUnload = function(self) {
}
const methods = {
	getData:function(){
		const self = this;
		self.getShareQR();
	},
	getShareQR: function () {
		let self = this
		let param = `/200/200/55`;
		// let code = User.getSignQrCode(self, {},param);
		// self.setData({
		// 	code: code 
		// })
		// User.getSignQrCode(self, {},param).then((ret) => {
		// 	console.log(333,ret)
		// 	self.setData({
		// 		code: ret
		// 	})
	    // }, (err) => {
	       
	    // });
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