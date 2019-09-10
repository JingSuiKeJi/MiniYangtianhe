const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
    classifyList: ['中西药品','中西药',],
    contentList: [
      {
        url: 'classify_goodsIcon.png',
        text: '眼耳鼻喉'
      },
    ],
    type: 0,
    title: '中西药品'
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
      // if (!self.data.value) return;
      _g.navigateTo({
        url: 'pages/search/detailList',
        param: {
            value: self.data.value
        }
       }, self);
    },
    onChoseTap: function (e) {
      let self = this;
      let type = e.target.dataset.type;
      console.log(22)
      self.setData({
        type: type,
        title: self.data.classifyList[type]
      })
    },
    onCheckDetail: function (e) {
      let self = this;
      console.log(22)
      _g.navigateTo({
        url: 'pages/goods/detail'
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