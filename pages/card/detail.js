// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');
const Platfrom = require('../../service/Platfrom');
// 初始化数据
const data = {
    goodList: [],
    type: 0,
    iconList: [
        {
            url: 'cardDetail__bag.png',
            text: '自购省钱',
            id: 1
        },
        {
            url: 'cardDetail__money.png',
            text: '分享赚钱',
            id: 2
        },
        {
            url: 'cardDetail__ticket.png',
            text: '极速发货',
            id: 3
        },
        {
            url: 'cardDetail__post.png',
            text: '优先配送',
            id: 4
        },
        {
            url: 'cardDetail__level.png',
            text: '级别晋升',
            id: 5
        },
        {
            url: 'cardDetail__coffee.png',
            text: '线下活动',
            id: 6
        },
    ],
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//

};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        platformFlag: self.data.platformFlag,
        goodsIds: self.data.goodsIds,
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    })
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
         self.getGoodsList();
    },
    getGoodsList: function() {
        const self = this;
        Platfrom.getGoodsList(self,{
            platformFlag: self.data.platformFlag,
            goodsIds: self.data.goodsIds,
            page: 0,
        }).then((ret) => {   
            self.setData({
                goodList: ret.data.list,
                id: ret.data.list[0].id
            })
           self.getGoodsDetail()
        }, (err) => { });
    },
    getGoodsDetail: function() {
        const self = this;
        Goods.getGoodsDetail(self,{
            id: self.data.id,
            thirdId: self.data.thirdId
        }).then((ret) => {  
           let data = ret.data;
           let imgUrl = data.description ? data.description.split(',') : []
           self.setData({
            goodsDetail: data,
            imgUrl: imgUrl
           })
        }, (err) => { });
    },
    onClickTap: function (e) {
        let self = this;
        let type = Number(e.currentTarget.dataset.type);
        self.setData({
            type: type,
            id: self.data.goodList[type].id
        });
        self.getGoodsDetail();
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
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
            id: self.data.goodsDetail.id,
            num: 1,
            skuId: 1
        };
        self.hideModal();
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: data,
                platformFlag: self.data.goodsDetail.platformFlag,
            },
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