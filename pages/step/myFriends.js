// pages/step/myFriends.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
  type: 1,
  list: [
    {
      url: 'mafriends_personal.png',
      name: '命运的杰克命运',
      step: '25725步',
      status: 1,//1完成 0 未完成
      text: '未完成',
    }
  ]
};

// 页面onLoad方法
const onLoad = function (self) {
    
    
};

// 页面onShow方法
const onShow = function (self) {
    
};
const onUnload= function (self) {
    
}
// 页面中的方法
const methods = {
  onChoseTap: function (e) {
    let self = this;
    self.setData({
      type: e.target.dataset.type
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