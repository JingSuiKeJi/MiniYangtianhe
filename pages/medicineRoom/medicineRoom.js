// pages/medicineRoom/medicineRoom.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;

// 初始化数据
const data = {
// value: 0
};

// 页面onLoad方法
const onLoad = function (self) {
   self.getData();
};

// 页面onShow方法
const onShow = function (self) {
   self.getData();
};
const onUnload= function (self) {

}
// 页面中的方法
const methods = {
    getData: function () {
      let self = this;
    },
    onSkipTap: function (e) {
      let self = this;
      wx.switchTab({
        url: "../../pages/store/store"
      })
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
    onUnload: onUnload
});
Page(initPage);