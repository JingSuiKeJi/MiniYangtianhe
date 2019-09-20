// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
    goodList: [
        {
            url: 'my_tea.png',
            price: '88',
        },
        {
            url: 'my_tea.png',
            price: '88',
        },
        {
            url: 'my_tea.png',
            price: '88',
        },
        {
            url: 'my_tea.png',
            price: '88',
        },
        {
            url: 'my_tea.png',
            price: '88',
        },
    ],
    type: 0,
    iconList: [
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
        {
            url: 'card__coffee.png',
            text: '自购省钱',
        },
    ],
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

    },
    onClickTap: function (e) {
        let self = this;
        self.setData({
            type: Number(e.currentTarget.dataset.type)
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