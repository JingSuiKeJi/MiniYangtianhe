
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platfrom = require('../../service/Platfrom');
// 初始化数据
const data = {
    platformFlag: 1,
    list: []
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getData();
};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload = function (self) {

}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.rightsCard();
    },

    rightsCard: function () {
        let self = this;
        Platfrom.rightsCard(self, {
            platformFlag: self.data.platformFlag
        }).then((ret) => {
            let data = ret.data;
            if (!_.isEmpty(data)) {
                self.setData({
                    goodsIds: data.goodsIds,
                    thirdId: data.id
                });
                self.getGoodsList();
            }
        }, (err) => {

        });
    },
    getGoodsList: function () {
        const self = this;
        Platfrom.getGoodsList(self, {
            platformFlag: self.data.platformFlag,
            goodsIds: self.data.goodsIds,
            page: 1,
            pageSize: 4,
            type: 3
        }).then((ret) => {
            self.setData({
                list: ret.data.list
            })

        }, (err) => { });
    },
    onSkipTap: function () {
        let self = this;
        _g.navigateTo({
            url: 'pages/card/rightsCard',
            param: {
                platformFlag: self.data.platformFlag,
            }
        }, self);
    },
    onDetailTap: function (e) {
        let self = this;
        if (!self.data.list.length) {
            _g.toast({
                title: '运营小姐姐还没上架商品哦，请稍后再试',
                duration: 2000
            });
            return;
        }
        _g.navigateTo({
            param: {
                goodsIds: self.data.goodsIds,
                platformFlag: self.data.platformFlag,
                thirdId: self.data.thirdId
            },
            url: 'pages/card/detail',
        }, self);
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