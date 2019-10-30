// pages/goods/more.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');

// 初始化数据
const data = {
    list: []
    // value: 0
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getPageData();
};

// 页面onShow方法
const onShow = function (self) {
};
const onUnload = function (self) {
    clearInterval(self.data.timer);
}
// 页面中的方法
const methods = {
    getPageData: function () {
        var self = this;
        //更多拼团
        Goods.getUserAssembleList(self, {
            page: self.data.page,
            pageSize: 20,
            activeId: self.data.activeId,
            goodsId: self.data.goodsId
        }).then((ret) => {
            let data = ret.data;
            if (self.data.page == 1) {
                self.setData({
                    list: data.list,
                });
            } else {
                self.setData({
                    list: self.data.list.concat(data.list),
                });
            }
            self.getCurrentTime();

        }, (err) => {

        });
    },
    getCurrentTime: function () {
        let self = this;
        let curTime = new Date().getTime() / 1000;
        self.setData({
            curTime: curTime
        })
        if (self.data.timer) clearInterval(self.data.timer);
        let timer = setInterval(() => {
            self.getCurrentTime()
        }, 1000);
        self.setData({
            timer: timer
        })
    },
    onJoinTap: function (e) {
        let self = this;
        _g.navigateTo({
            param: {
                userAssembleId: e.currentTarget.dataset.id
            },
            url: 'pages/goods/join'
        }, self)
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