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
const onLoad = function (self) {

};
const onShow = function (self) { };
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
    onLoginTap: function (e) {
        let self = this;
        console.log(5555)
        if (self.data.isLogin) {
            _g.switchTab({
                url: 'pages/home/index'
            },self)
        }
    },
    onLaterLogin: function (e) {
        let self = this;
        _g.switchTab({
            url: 'pages/home/index'
        },self)
    }
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