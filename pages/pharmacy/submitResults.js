// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {};
const onLoad = function(self) {
    self.setData({
        withdrawId: self.data.withdrawId 
    });
    self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
    getData: function () {
       let self = this;
       self.withdrawDetail();
    },
    withdrawDetail: function () {
        let self =  this;
        User.withdrawDetail(self, {
            withdrawId: self.data.withdrawId 
        }).then((ret) => {
            self.setData({
				money: ret.data.money
			})
        }, (err) => {
           
        });
    },
	//跳转到申请详情
	onDetails:function(){
		 let self = this;
	    _g.navigateTo({
            url: 'pages/pharmacy/applicationDetails',
            param: {
                withdrawId: self.data.withdrawId
            }
	    }, self);
    },
    onBackHome: function () {
        let self = this;
        wx.switchTab({
            url: '../../pages/home/index'
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