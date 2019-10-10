// pages/search/search.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
    tagList: [],
    hisList: [],
    key: 'hisList'
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        platformFlag: self.data.platformFlag
    })
    self.getData();
};

// 页面onShow方法
const onShow = function (self) {
    self.getData();
};
const onUnload = function (self) {

}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.getHotSearchList();
        
    },
    getHotSearchList: function () {
        let self = this;
        Goods.getHotSearchList(self, {
            platformFlag: self.data.platformFlag,
        }).then((ret) => {
             self.setData({
                tagList: ret.data
             });
             self.getHisList();
        }, (err) => {

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
        let opts = e.target.dataset;
        let param = {
            platformFlag: self.data.platformFlag
        }
        if (opts.type == '1') {
            param.value = opts.title;
        } else {
            // if (!self.data.value) return;
            param.value = self.data.value;
            self.setHisttory(self.data.value);
        }
        _g.navigateTo({
            url: 'pages/search/detailList',
            param: param
        }, self);
    },
    onDelectTap: function (e) {
        let self = this;
        wx.setStorageSync(self.data.key, []);
        self.getHisList();
    },
    //设置历史记录
    setHisttory: function (value) {
       let self = this;
       let key = self.data.key;
       let storage = wx.getStorageSync(self.data.key);
       if (storage) {
           storage.push(value);
          wx.setStorageSync(key, storage);
       } else {
           storage = [value]
           wx.setStorageSync(key, storage);
       }
    },
    //获取本地缓存
    getHisList: function () {
       let self = this; 
       let hisList = wx.getStorageSync(self.data.key)
        self.setData({
            hisList: hisList
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