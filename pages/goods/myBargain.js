// pages/goods/myBargain.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods')
// 初始化数据
const data = {
    classfity: ['进行中', '已完成', '已失效',],
    isSelect: 0,
    allList: [
        {
            url: 'renshen.png',
            title: '中药人参红枣',
            useful: '补血活血，调经止痛，润肠通便。用于血虚萎黄，眩晕心悸，月经不调，经闭痛…月经不调',
            prePrice: '19.00',
            nowPrice: '9.99',
            personNum: '245',


        }
    ],
    status: 1,//1.进行中  3.已完成 4.已失效
    type: 0,
    platformFlag: 1,
};

// 页面onLoad方法
const onLoad = function (self) {
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
        self.getPageData();
    },
    getPageData: function (e) {
        let self = this;
        Goods.myCut(self, {
            status: self.data.status,
            page: self.data.page,
            pageSize: 10
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data.list,
                hasNextPage: data.hasNextPage,
            });
            self.getCurrentTime();
            clearInterval(self.data.timer);
            let timer = setInterval(() => {
                self.getCurrentTime()
            }, 1000);
            self.setData({
                timer: timer
            })
        }, (err) => {
        });
    },
    getCurrentTime: function () {
        let self = this;
        let curTime = new Date().getTime() / 1000;
        self.setData({
            curTime: curTime
        })
    },
    onSelectTap: function (e) {
        let self = this;
        let status = 0;
        let type = e.currentTarget.dataset.type;
        if (self.data.type == type) return;
        switch (type) {
            case 0:
                status = 1;
                break;
            case 1:
                status = 2;
                break;
            default:
                status = 4;
                break;
        }
        self.setData({
            type: type,
            status: status
        });
        self.getPageData();
    },
    onBargainTap: function (e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let list = self.data.list;
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: {
                    id: list[index].goodsId,
                    num: 1,
                    platformFlag: self.data.platformFlag
                },
                platformFlag: self.data.platformFlag,
                from: 'myBargain',
                thirdId: list[index].activityId,
            }
        }, self)
    },
    onDetailTap: function (e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let list = self.data.list;
        _g.navigateTo({
            url: 'pages/goods/bargain',
            param: {
                goodsId: list[index].goodsId,
                userCutId: list[index].userCutId,
                platformFlag: self.data.platformFlag,
            }
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