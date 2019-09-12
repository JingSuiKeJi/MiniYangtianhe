
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
// 初始化数据
const data = {
    type: 0,
     list: [],
     tapList: ['默认','价格','销量'],
     page: 1,
     priceSort: 1,// 价格排序 1 是升序，2是降序
     value: '你好'
};

// 页面onLoad方法
const onLoad = function (self) {
    let data = {
         value: self.data.value,
         platformFlag: self.data.platformFlag
    }
    if (self.data.flag) {
    wx.setNavigationBarTitle({
        title: '全部分类',
    })
    } else {
        wx.setNavigationBarTitle({
        title: '搜索',
        })
    }
    if (self.data.value) {
        data.value = self.data.value;
    }
    if (self.data.classifyId) {
        data.classifyId = self.data.classifyId;
    }
    if (self.data.brandId) {
        data.brandId = self.data.brandId
    }
    self.setData(data); 
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
        self.getPageData();
    },
    onChoseTap: function(e) {
        let self = this;
        const opts = e.target.dataset;
        if (opts.type == self.data.type && opts.type == 1) {
            switch(self.data.priceSort) {
                case 1:
                    self.setData({
                        priceSort: 2
                    });
                    break;
                default:
                    self.setData({
                        priceSort: 1
                    });
            } 
        } else if (opts.type == self.data.type) {
          return;
        } else {
            self.setData({
                type: opts.type,
                priceSort: 1,
                soldNumSort: 1
          });
        }
        self.getPageData();  
    },
    onGetInput: function (e) {
        let self = this;
        self.setData({
            value: e.detail.value
        })
    },
    onDetailTap: function (e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: { id: opts.id}
        },self)
    },
    getPageData: function () {
        let self = this;
        let data = {
            platformFlag: self.data.platformFlag,
            page: self.data.page,
            pageSize: 10,
            keyword: self.data.value,
        }
        if (self.data.classifyId) {
            data.classifyId = self.data.classifyId;
        }
        if (self.data.brandId) {
            data.brandId = self.data.brandId
        }
        if (self.data.type == 1) {
            data.priceSort = self.data.priceSort
        }
        if (self.data.type == 2) {
            data.soldNumSort = 2
        }
        Platform.getGoodsList(self, data 
        ).then((ret)=>{
           let param = ret.data;
           self.setData({
               list: param.list
           });
        },(err)=>{
        });
    },
    onSkipTap: function () {
        let self = this;
        self.getPageData();
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
