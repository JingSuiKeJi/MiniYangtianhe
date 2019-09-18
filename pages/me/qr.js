// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const platfrom = require('../../service/Platfrom');
let data = {};
const onLoad = function (self) {
    self.setData({
		userInfo: _g.getLS(_c.LSKeys.userInfo)
	})
	self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
    getData: function () {
        let self = this;
        self.getShareQR();
    },
    getShareQR: function () {
        let self = this;
        platfrom.getShareQR(self, {
            scene: 'promoCode=e23a1f'
        }).then((ret) => {
            self.setData({
				shareQR: ret.data.shareQR
			})
        }, (err) => {
           
        });
        
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