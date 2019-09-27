// pages/goods/myBargain.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Platfrom = require('../../service/Platfrom');
const Goods = require('../../service/Goods')
// 初始化数据
const data = {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    type: '',
    title: '我的',
    hideShareDialog: true,
    authorizeHidden: true,
    canvasUrl: ''
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        goodsId: self.data.goodsId,
        userCutId: self.data.userCutId,
        platformFlag: self.data.platformFlag,
    });
    self.getData();
    event.on('goods-bargain-shareEvent', self, (data) => {
        self.setData({
            canvasUrl: data.canvasUrl
        });
    });
};
const onReady = function (self) {
    setTimeout(function () {
        self.poster = self.selectComponent('#poster');
        self.poster.onHideShareTap = function () {
            self.setData({
                hideShareDialog: true
            });
        }
        self.authorize = self.selectComponent('#authorize');
        self.authorize.onCancelTap = function () {
            self.setData({
                authorizeHidden: true
            });
        }
    }, 1000);
    event.on('goods-bargain-openAuthorize', self, function (data) {
        self.setData({
            authorizeHidden: false
        });
    });
}
// 页面onShow方法
const onShow = function (self) {
};
const onUnload = function (self) {
    event.remove('goods-bargain-shareEvent', self);
}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.cutDetail()
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
    cutDetail: function () {
        let self = this;
        Goods.cutDetail(self, {
            platformFlag: self.data.platformFlag,
            userCutId: self.data.userCutId,
            goodsId: self.data.goodsId
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data,
                width: data.alreadyCutPrice / (data.beginPrice - data.lowPrice) * 426, //426 为总进度条的宽度
                goodsDetail: {
                    picUrl: data.imgUrl,
                    nowPrice: data.currentPrice,
                    originPrice: data.beginPrice,
                    mainTitle: data.title,
                },
                title: data.nickName
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
    helpCut: function () {
        let self = this;
        Goods.helpCut(self, {
            userCutId: self.data.userCutId,
        }).then((ret) => {
            self.setData({
                money: ret.data
            }); 
            self.getData();
            self.showModal();
           
        }, (err) => {
        });

    },
    onOperation: function (e) {
        let self = this;
        self.helpCut();
    },
    getCurrentTime: function () {
        let self = this;
        let curTime = new Date().getTime() / 1000;
        self.setData({
            curTime: curTime
        })
    },
    // 显示遮罩层
    showModal: function (e) {
        let self = this;
        if (e) {
            self.setData({
                type: Number(e.currentTarget.dataset.type),
                hideModal: false
            })
        } else {
            self.setData({
                type: 2,
                hideModal: false
            })
        }

    },
    // 隐藏遮罩层
    hideModal: function () {
        let self = this;
        self.setData({
            hideModal: true
        })
    },
    onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: {
                id: self.data.goodsId,
                thirdId: self.data.list.activityId
            }
        }, self)
    },
    onMoreTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/bargainList'
        }, self)
    },
    onShareTap: function (e) {
        let self = this;
        self.setData({
            hideShareDialog: false
        });
    },
    onShareAppMessage() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        let path = 'pages/goods/bargain?userCutId=' +
            self.data.userCutId + '&goodsId=' +
            self.data.goodsId + '&platformFlag=' +
            self.data.platformFlag;
        if (userInfo) {
            path += '&promoCode=' + userInfo.promoCode;
        }
        return {
            title: self.data.goodsDetail.mainTitle,
            path: path,
            imageUrl: self.data.canvasUrl
        }
    },
    onSubmitTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: {
                    id: self.data.goodsId,
                    num: 1,
                    platformFlag: self.data.platformFlag
                },
                platformFlag: self.data.platformFlag,
                from: 'bargain',
                thirdId: self.data.list.activityId,
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
    onUnload: onUnload,
    onReady: onReady
});
Page(initPage);