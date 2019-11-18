// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Platfrom = require('../../service/Platfrom');

let data = {
	userInfo:{},//接收上一页用户信息
	shareQR:'',//门店二维码
	picThumb: {},
	shareCode: {},
	avatarThumb: {},
	canvasUrl: '',
	authorizeHidden: true,
};

const onLoad = function(self) {
	//接收上一个页面状态
	const userInfo = self.data.userInfo;
	self.setData({
		userInfo:userInfo,
	});
	event.on('me-storeQRCode-authorize', self, (res)=>{
		if (res.detail.authSetting['scope.writePhotosAlbum']) {
        	self.savePicToAlbum();
        	self.setData({
	            authorizeHidden: true,
	            showModal: false
	        });
        }
	});
	//self.getData();
}

const onShow = function(self) {}

const onReady = function(self) {
	self.authorize = self.selectComponent('#authorize');
    self.authorize.onCancelTap = function () {
        self.setData({
            authorizeHidden: true
        });
    }
}

const onUnload = function(self) {
	event.remove('me-storeQRCode-authorize', self);
}

const methods = {

}

const temps = {}

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