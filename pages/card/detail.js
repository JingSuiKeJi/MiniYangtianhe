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
            url: 'cardDetail__bag.png',
            text: '自购省钱',
        },
        {
            url: 'cardDetail__money.png',
            text: '分享赚钱',
        },
        {
            url: 'cardDetail__ticket.png',
            text: '极速发货',
        },
        {
            url: 'cardDetail__post.png',
            text: '优先配送',
        },
        {
            url: 'cardDetail__level.png',
            text: '级别晋升',
        },
        {
            url: 'cardDetail__coffee.png',
            text: '线下活动',
        },
    ],
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//

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
    },
    showModal: function () {
        let self = this;
        self.setData({
            hideModal: false
        })
    },
    // 隐藏遮罩层
    hideModal: function () {
        let self = this;
        self.setData({
            hideModal: true
        })
    },
    onBuyTap: function (e) {
        let self = this;
        self.hideModal();
        _g.navigateTo({
            url: 'pages/order/submit'
        },self)
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