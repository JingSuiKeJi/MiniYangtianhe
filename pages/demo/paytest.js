// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
// const User = require('../../service/User');

// 初始化数据
const data = {
    logo: 'https://app.aiqinyouxuan.com/app/icon.png',
    protocolShow: true
};
// 页面onLoad方法
const onLoad = function (self) {

};
// 页面onShow方法
const onShow = function (self) {

};

// 页面中的方法
const methods = {
    onPayTap: function () {
        let self = this;
        var reqObj = {
            totalFee: 0.01
        };
        User.prepay(self, reqObj).then(function (ret) {
            let payInfo = ret.data;
            payInfo.success = function () {
                _g.showModal({
                    title: '温馨提示',
                    content: '支付成功',
                    confirm: function () {
                        _g.navigateBack();
                    }
                });
            };
            _g.requestPayment(payInfo);
        }, function (error) {
            _g.logger(error);
            _g.hideToast();
            _g.showModal({
                title: '温馨提示',
                content: error.message
            })
        });
    }
};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onShow: onShow,
    methods: methods,
    temps: temps,
});
Page(initPage);
