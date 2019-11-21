// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Store = require('../../service/Store.js');

let data = {
    lon: 113.403051,
    lat: 23.131432,
    markerList: [],
    friendsList: [],
};
const onLoad = function (self) {
    const userInfo = _g.getLS(_c.LSKeys.userInfo);
    self.setData({
        userInfo: userInfo
    })
    self.getData();
}
const onShow = function (self) {

}

const onReady = function (self) { }

const onUnload = function (self) { }

const methods = {
    getData: function () {
        let self = this;
        self.signHome();
        self.getPageData();
    },
    signHome: function () {
        let self = this;
        Store.signHome(self, {
            miniUserId: self.data.userInfo.id
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                store: data.signStoreVo,
                info: data,
                signList: data.signScoreItemList,
                lon: data.signStoreVo.lon,
                lat: data.signStoreVo.lat,
                markerList: [{
                    iconPath: "/images/mapIcon.png",
                    latitude: data.signStoreVo.lat,
                    longitude: data.signStoreVo.lon,
                    width: 38,
                    height: 38,
                    title: data.signStoreVo.title,
                }
                ],
            })
        }, (err) => {
        });
    },
    signIn: function (code) {
        let self = this;
        Store.signIn(self, {
            code: code
        }).then((ret) => {
            self.getData();
            _g.navigateTo({
                url: 'pages/shop/signFinish',
                param: {
                    point: ret.data
                }
            }, self)
        }, (err) => {
        });
    },
    getPageData: function () {
        let self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        Store.signMyFriend(self, {
            page: self.data.page,
            pageSize: 10,
            miniUserId: userInfo.id
        }).then((ret) => {
            let data = ret.data
            if (self.data.page == 1) {
                self.setData({
                    friendsList: data.list,
                    hasNextPage: data.hasNextPage
                })
            } else {
                self.setData({
                    friendsList: self.data.friendsList.concat(data.list),
                    hasNextPage: data.hasNextPage
                })
            }


        }, (err) => {

        });
    },
    onBubbleTap(e) {
    },
    bindupdated(e) {

    },
    bindregionchange(e) {

    },
    onCodeTap: function () {
        let self = this;
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                self.signIn(res.result)
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