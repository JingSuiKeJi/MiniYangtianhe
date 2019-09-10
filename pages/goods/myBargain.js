// pages/goods/myBargain.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;

// 初始化数据
const data = {
  classfity: ['进行中','已完成','已失效',],
  isSelect: 0,
  allList: [
    {
      url: 'renshen.png',
      title: '中药人参红枣',
      useful: '补血活血，调经止痛，润肠通便。用于血虚萎黄，眩晕心悸，月经不调，经闭痛…月经不调',
      prePrice: '19.00',
      nowPrice: '9.99',
      personNum: '245',


    }
  ],
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
    onSelectTap: function (e) {
      let self = this;
      self.setData({
        isSelect: e.target.dataset.type
      })
    },
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