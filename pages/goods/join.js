// pages/goods/join.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
// value: 0
};

// 页面onLoad方法
const onLoad = function (self) {
   self.getData();
};

// 页面onShow方法
const onShow = function (self) {
    self.getData();
};
const onUnload= function (self) {
    clearInterval(self.data.timer);
}
// 页面中的方法
const methods = {
    getData: function () {
       let self = this;
       self.getUserAssembleDetail();
    },
    getUserAssembleDetail: function () {
        let self = this;
        Goods.getUserAssembleDetail(self, {
            userAssembleId: self.data.userAssembleId
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                goods: data.goodsVo,
                diffNum: data.diffNum,
                endTime: data.endTime,
                assembleMemberVOList: data.assembleMemberVOList,
                platformFlag: data.platformFlag,
                thirdId: data.thirdId
            })
            self.getCurrentTime();
        }, (err) => {

        });
    },
    getCurrentTime: function () {
        let self = this;
        let curTime = new Date().getTime() / 1000;
        self.setData({
            curTime: curTime
        });
       if (self.data.timer) clearInterval(self.data.timer);
        let timer = setInterval(() => {
            if (self.data.endTime == self.data.curTime) {
                clearInterval(self.data.timer); 
                return;
            }
            self.getCurrentTime();
        }, 1000);
        self.setData({
            timer: timer
        })
    },
    onJoinTap: function (e) {
        let self = this;
        let opts = self.data;
        let data = {
            platformFlag: opts.platformFlag,
            id: opts.goods.id,
            num: opts.goods.num,
            isJoin: 1,
            thirdId: self.data.userAssembleId,
            skuId: 0
        };
        //navigateTo
        _g.redirectTo({
            url: 'pages/order/submit',
            param: {
                postData: data,
                platformFlag: self.data.platformFlag,
                from: 'join',
            },
        }, self);
    },
    onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
            param: {
               id: self.data.goods.id,
               thirdId: self.data.thirdId
            },
            url: 'pages/goods/detail'
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