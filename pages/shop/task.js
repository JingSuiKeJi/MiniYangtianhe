// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Store = require('../../service/Store.js');

let data = {
	signInfo: {}
	
};

const onLoad = function(self) {
	const userInfo = _g.getLS(_c.LSKeys.userInfo);
	self.setData({
        userInfo: userInfo
    })
    self.getData();
}

const onShow = function(self) {}

const onReady = function(self) {
	
}

const onUnload = function(self) {
	
}

const methods = {
	getData: function () {
		let self = this;
		self.taskSignHome();
	},
	taskSignHome: function () {
		let self = this;
		Store.taskSignHome(self, {
			miniUserId: self.data.userInfo.id
		}).then((ret) => {
           self.setData({
			signInfo: ret.data
		   })
		}, (err) => {
		}); 
	},
	taskSignIn: function () {
		let self = this;
		const userInfo = _g.getLS(_c.LSKeys.userInfo);
        Store.taskSignIn(self, {
			miniUserId: userInfo.id
		}).then((ret) => {
			self.getData();
            _g.navigateTo({
                url: 'pages/shop/signFinish',
                param: {
                    point: self.data.signInfo.point
                }
            },self)
		}, (err) => {
		});
	},
	
	onCodeTap:function () {
        let self = this;
        self.taskSignIn();
	},
	onGoTap:function () {
		let self = this;
        _g.navigateTo({
			url: 'pages/me/blissDetail',
		},self)
	},
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