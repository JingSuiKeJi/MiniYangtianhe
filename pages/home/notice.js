// pages/search/search.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
    url: 'http://120.79.36.152/share/html/protocol/index_frame.html?type=article&id='
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        url: self.data.url + self.data.id
    })
};

// 页面onShow方法
const onShow = function (self) {
    
};
const onUnload = function (self) {

}
// 页面中的方法
const methods = {
    
};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onShow: onShow,
    methods: methods,
    onUnload: onUnload
});
Page(initPage);