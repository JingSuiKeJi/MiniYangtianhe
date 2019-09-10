// pages/search/brandList.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
  type: 1,
  baseUrl: '../../images/',
   list: [
     {
        title: '红豆口味，清热解毒，男女老少都爱吃',
        scale: '【4盒装】 [生和堂] 红豆龟苓膏 200gx4盒',
        prePrice: '14.00',
        nowPrice: '10.00' ,
        count: '3125',
        url: 'zhengqiwan.png'
     }
  ],

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
            url: 'pages/goods/detail'
          },self)
        },
        onChoseTap: function(e) {
          let self = this;
          self.setData({
            type: e.target.dataset.type
          });
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