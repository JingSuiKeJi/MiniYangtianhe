
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;

// 初始化数据
const data = {
    type: 0,
     list: [
       {
        title: '藿香正气胶囊，防暑降温。',
        scale: '防暑降温组包[曼秀雷敦]复方薄荷软膏+[太极]藿香正气胶呱呱呱嘎嘎嘎规格',
        prePrice: '19.00',
        nowPrice: '9.00' ,
        count: '1120',
        url: 'zhengqiwan.png'
       },
    ],
     tapList: ['默认','价格','销量']
};

// 页面onLoad方法
const onLoad = function (self) {
      self.setData({
        value: self.data.value,
        flag: self.data.flag
      });
      if (self.data.flag) {
        wx.setNavigationBarTitle({
          title: '全部分类',
        })
      } else {
          wx.setNavigationBarTitle({
            title: '搜索',
          })
      }
      self.getData();
};

// 页面onShow方法
const onShow = function (self) {
      self.getData();
};
const onUnload= function (self) {
        _g.getPrevPage().setData({
            num: self.data.value
        })
}
// 页面中的方法
const methods = {
      getData: function () {
          let self = this;
      },
      onChoseTap: function(e) {
        let self = this;
        self.setData({
          type: e.target.dataset.type,
        });
        
      },
      onGetInput: function (e) {
        let self = this;
        self.setData({
          value: e.detail.value
        })
      },
      onSkipTap: function (e) {
        let self = this;
        console.log(self.data.value)
      },
      onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
          url: 'pages/collage/detail'
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
