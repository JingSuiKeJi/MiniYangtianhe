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
    onShow: false
};
const onLoad = function(){

}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}

const methods = {
    hideModal: function(){
        const self = this;
        self.setData({
            onShow: !self.data.onShow
        })
    }
}

const temps = {

}


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