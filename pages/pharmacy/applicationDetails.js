// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
// const User = require('../../service/User');
// const Platfrom = require('../../service/Platfrom');
const Withdraw = require('../../service/Withdraw');
let data = {
	currentStatus:false,//当前受理状态
};
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
        // self.getCurrTime();
     },
     withdrawDetail: function () {
         let self =  this;
         Withdraw.detail(self, {
             withdrawId: self.data.withdrawId 
         }).then((ret) => {
             self.setData({
                 list: ret.data
             })
         }, (err) => {
            
         });
     },
     // getCurrTime: function name() {
     //    let self =  this;
     //    Platfrom.getCurrTime(self, {
     //    }).then((ret) => {
     //        self.setData({
     //            currTime: ret.data.currTime
     //        })
     //    }, (err) => {
           
     //    });
     // }
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