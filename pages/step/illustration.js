// pages/step/illustration.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platfrom = require('../../service/Platfrom');
// 初始化数据
  const data = {
      
  };
  
  // 页面onLoad方法
  const onLoad = function (self) {
     self.getData();
      
  };
  
  // 页面onShow方法
  const onShow = function (self) {
     
  };
  const onUnload= function (self) {
     
  }
  // 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        Platfrom.getArticle(self, {
            type: 'pointsRule'
        }).then((ret)=>{
            let data = ret.data;
            self.setData({
               rules: data
            });
          
        },(err)=>{
        });
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