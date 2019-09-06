// pages/search/search.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
   tagList: ['清热解毒','清热','清热解毒','清热解','清热解','清热解毒'],
    hisList: ['消炎药药','消炎药','消炎药','消炎','消炎药','消炎药药药',]
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
    onGetInput: function (e) {
      let self = this;
      self.setData({
        value: e.detail.value
      })
    },
    onSkipTap: function(e) {
      let self = this;
      if (!self.data.value) return;
      _g.navigateTo({
        url: 'pages/search/detailList',
        param: {
            value: self.data.value
        }
       }, self);
    },
    onDelectTap: function (e) {
      let self = this;
      self.setData({
        hisList: []
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