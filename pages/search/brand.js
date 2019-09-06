// pages/search/brand.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
  imgBottomList: [
    {
      url: 'zhongsheng.png',
      title: '汤臣倍健',
    },
    {
      url: 'zhongsheng.png',
      title: '汤臣倍健',
    },
    {
      url: 'zhongsheng.png',
      title: '汤臣倍健',
    },
    {
      url: 'zhongsheng.png',
      title: '汤臣倍健',
    },

  ],
  list: [
    {
      sort: 'A',
      url: 'zhongsheng.png',
      text: '人和药业'
    },
    {
      sort: 'A',
      url: 'zhongsheng.png',
      text: '人和药业'
    },
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
        onDetailTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/search/brandList'
          },self)
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