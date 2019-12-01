// pages/goods/bargainList.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platfrom = require('../../service/Platfrom');
const Goods = require('../../service/Goods')
// 初始化数据
const data = {
    classfity: ['全部', '中西药品', '营养保健', '养生花茶', '情趣计生',],
    isSelect: 0,
    personList: [
        {
            url: 'my_ snapshoot.png',
            name: 'Amy',
        },
        {
            url: 'my_infoBoxAvatar.png',
            name: 'Mia'
        }
    ],
    top: 200,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    platformFlag: 1,
    ruleUrl: 'http://120.79.36.152/share/html/protocol/index_frame.html?type=article&id=cutRule'
};

// 页面onLoad方法
const onLoad = function (self) {
    self.moveBarrage();
    self.getData();
};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload = function (self) {
    clearInterval(self.data.timer);
};
// 页面中的方法
const methods = {
    getData: function (e) {
        let self = this;
        self.getArticle();
        self.getPageData();
    },
    getArticle: function () {
        let self = this;
        Platfrom.getArticle(self, {
            type: 'assembleRule'
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                rules: data
            });

        }, (err) => {
        });
    },
    getPageData: function (e) {
        let self = this;
        Goods.listCut(self, {
            platformFlag: self.data.platformFlag,
            page: self.data.page,
            pageSize: 20
        }).then((ret) => {
            let data = ret.data;
            if (data.list ) {
                let list = data.list;
                if (self.data.page == 1) {
                    self.setData({
                        list: list,
                        width: (list.stock - list.remainStock) / list.stock * 200,
                        hasNextPage: data.hasNextPage
                    });
                } else {
                    self.setData({
                        list: self.data.concat(list),
                        width: (list.stock - list.remainStock) / list.stock * 200,
                        hasNextPage: data.hasNextPage
                    });
                }
            } else {
                self.setData({
                    list: [],
                    width: (list.stock - list.remainStock) / list.stock * 200,
                });
            }
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
    createCut: function (thirdId, goodsId) {
        let self = this;
        Goods.createCut(self, {
            cutId: thirdId,
            goodsId: goodsId
        }).then((ret) => {
            _g.navigateTo({
                url: 'pages/goods/bargain',
                param: {
                    goodsId: goodsId,
                    userCutId: ret.data,
                    platformFlag: self.data.platformFlag,
                }
            }, self)

        }, (err) => {
        });
    },
    onDetailTap: function (e) {
        let self = this;
        let opt = e.currentTarget.dataset;
        if (!_g.checkLogin({ type: 2 })) return;
        self.createCut(opt.cutid, opt.goodsid);
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
        self.setData({
            isSelect: e.target.dataset.type
        })

    },
    onSkipTap: function (e) {
        let self = this;
        let opt = e.currentTarget.dataset
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: {
                id: opt.id,
                thirdId: opt.thirdid
            }
        }, self)
    },

    onBargainTap: function (e) {
        let self = this;
        if (!_g.checkLogin({ type: 2 })) return;
        _g.navigateTo({
            url: 'pages/goods/myBargain',
            param: {
                platformFlag: self.data.platformFlag,
            }
        }, self)
    },
    moveBarrage: function () {
        let self = this;
        let length = self.data.personList.length;
        let dis = (length - 1) * 76 + 300;
        let second = dis / 37.5;
        let top = self.data.top - dis;
        self.setData({
            top,
            second
        });
    },
    // 显示遮罩层
    showModal: function () {
        const self = this;
        _g.navigateTo({
            url: 'pages/home/notice',
            param: {
                urlParam: `type=article&id=cutRule`
            }
        }, self);
    },
    // 隐藏遮罩层
    hideModal: function () {
        var self = this;
        self.setData({
            hideModal: true
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
    onUnload: onUnload,
});
Page(initPage);