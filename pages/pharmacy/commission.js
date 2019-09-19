// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {
    withdrawlist: []
};
const onLoad = function (self) { 
    self.setData({
        money: self.data.money
    })
    self.getData();
};
const onShow = function (self) { };
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
    getData: function () {
        let self = this;
        self.getPageData();
    },
    getPageData: function () {
        let self = this;
        User.distributionList(self, {
            page: self.data.page,
            pageSize: 10
        }).then((ret) => {
            self.setData({
                withdrawlist: ret.data.list,
			});
        }, (err) => {
           
        });
        
    },
    onApplicationTap: function () {
		let self = this;
		_g.navigateTo({
			url: 'pages/pharmacy/application',
			param: {
				money: self.data.money,
			}
		}, self);
	},

    
};

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