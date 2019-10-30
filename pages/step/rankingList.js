// pages/step/index.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const User = require('../../service/User');
// 初始化数据
const data = {
    list: []
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getData();
};

// 页面onShow方法
const onShow = function(self) {
    
};
const onUnload = function(self) {
    
};
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.getPageData();
    },
    getPageData: function() {
        let self = this;
        User.rankingList(self, {
            page: self.data.page,
            pageSize: 20
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
                self.setData({
                    list: self.data.list.concat(data.list),
                    myStep: data.myStep,
                    // hasNextPage: data.hasNextPage
                });
            }
           

        }, (err) => {});
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