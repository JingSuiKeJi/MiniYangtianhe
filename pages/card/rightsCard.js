/// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platfrom = require('../../service/Platfrom');
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
    platformFlag: 1,
    list: [],
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
        self.getPageData();
    },
    getPageData: function () {
        let self = this;
        Platfrom.getCardGoodsList(self, {
            platformFlag: self.data.platformFlag,
            page: 1,
            pageSize: 20,
        }).then((ret) => {
            self.setData({
                list: ret.data.list
            })
        }, (err) => {

        });
    },
    onAddCart: function (e) {
        let self = this;
        let index = e.target.dataset.index;
        let list = self.data.list;
        let data = {
            platformFlag: self.data.platformFlag,
            goodsId: list[index].id,
            num: 1
        }
        Goods.addCart(self, data).then((ret) => {
            let data = ret.data;
            setTimeout(function() {
            	_g.toast({
            	    title: '添加购物车成功',
            		duration: 1500,
            	});
            }, 500);
            event.emit('refreshCart');
        }, (err) => {
            _g.toast({
                title: '加入购物车失败'
            });
        });
    },
    onSkipTap: function () {
        let self = this;
        _g.navigateTo({
            url: 'pages/card/rightsCard',
        }, self);
    },
    onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/card/detail',
        }, self);
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