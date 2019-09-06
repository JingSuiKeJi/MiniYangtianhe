// pages/step/index.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
  const data = {
      step: '上传步数',
      list: [
        {
          time: '2019.07.01',
          step: '1234步',
          status: 2,//0 进行中， 1 未达成 ， 2 完成
          text: '进行中'
        },
      ],
      hideModal:true, //模态框的状态  true-隐藏  false-显示
     animationData:{},//
  };
  
  // 页面onLoad方法
  const onLoad = function (self) {
    self.initBlock ();
      
  };
  
  // 页面onShow方法
  const onShow = function (self) {
     
  };
  const onUnload= function (self) {
     
  }
  // 页面中的方法
  const methods = {
        onIllustrationTap: function(e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/me/blissDetail'
          },self)
        },
        onCheckTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/step/myFriends'
          },self)
        },
        showModal: function () {
          let self = this;
          self.setData({
            hideModal:false
          })
        },
        // 隐藏遮罩层
        hideModal: function () {
          let self = this;
          self.setData({
            hideModal:true
          })  
        },
        onIllustrateTap: function (e) {
           let self = this;
          _g.navigateTo({
            url: 'pages/step/illustration'
          },self)
        },
        initBlock: function () {
          let self = this;
          var blockList = [];
          for (var i = 0; i < 31; i++) {
           if (i <= 14) {
            var a = 130;
           } else if (i == 15) {
            var a = 0;
           } else if (i >= 16) {
            var a = 130;
           }
           var rotate = ((a / 15) * i - a).toFixed(0);
           //y = y0 + r * sin(a * pi / 180)
           //x = x0 + r * cos(a * pi / 180)
           //(x0, y0) ==> (0, 0)
          var left =  (1.4* Math.sin(rotate * Math.PI / 180)).toFixed(2);
          var bottom =  (1.4 * Math.cos(rotate * Math.PI / 180)).toFixed(2);
           blockList.push({
            //  bottom: 0,
            // left: 0,
            bottom: bottom,
            left: left,
            rotate: rotate
           });
          }
          self.setData({
            blockList: blockList
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