// pages/search/brandList.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');
const Platfrom = require('../../service/Platfrom')

// 初始化数据
const data = {
    type: 0,
    list: [],
    priceSort: 1
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        brandId: self.data.id,
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
        self.getBrandDetail();
        self.getPageData();
    },
    getBrandDetail: function () {
        let self = this;
        Goods.getBrandDetail(self, {
            brandId: self.data.brandId,
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                backgroundUrl: data.backgroundUrl,
                title: data.title,
                logoUrl: data.logoUrl
            })
        }, (err) => {

        });
    },
    getPageData: function (option) {
        let self = this;
        let param = {
            brandId: self.data.brandId,
            platformFlag: self.data.platformFlag,
            page: self.data.page,
            pageSize: 20,
        }
        if (option) {
            _.extend(param, option);
        }
        Platfrom.getGoodsList(self, param
        ).then((ret) => {
            let data = ret.data;
            self.setData({
                list: self.data.list.concat(data.list),
                hasNextPage: data.hasNextPage
            })
        }, (err) => {

        });
    },
    onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: {
                id: e.currentTarget.dataset.id
            }
        }, self)
    },
    onChoseTap: function (e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        let data = {};
        if (opts.type == self.data.type && opts.type == 1) {
            data.priceSort = 2;
        } else if (opts.type != self.data.type && opts.type == 1) {
            self.setData({
                type: 1
            })
            data.priceSort = 1;
        } else if (opts.type == self.data.type) {
            return;

        } else {
            data.soldNumSort = 2;
            self.setData({
                type: Number(opts.type)
            })
        }
        self.setData({
            list: [],
            page: 1
        })
        self.getPageData(data);

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