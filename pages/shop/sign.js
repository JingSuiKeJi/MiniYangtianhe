// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Order = require('../../service/Order');
const Store = require('../../service/Store.js');

let data = {
    lon: 113.403051,
    lat: 23.131432,
    markerList: [{
        iconPath: "/images/mapIcon.png",
        id: 0,
        latitude: 23.11662,
        longitude: 113.3627,
        width: 38,
        height: 38,
        title: "天盈广场店"
      },
    ],
};
const onLoad = function (self) {
    
}
const onShow = function (self) {

}

const onReady = function (self) { }

const onUnload = function (self) { }

const methods = {
    onBubbleTap(e) {
    },
    bindupdated(e) {

    },
    bindregionchange(e) {

    },
    onCodeTap:function () {
        let self = this;
        wx.scanCode({
            onlyFromCamera: true,
            success (res) {
                console.log(555,res)
            }
        });
    }

}

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onUnload: onUnload,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    temps: temps,
});
Page(initPage);