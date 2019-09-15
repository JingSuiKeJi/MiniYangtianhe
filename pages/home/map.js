// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Store = require('../../service/Store.js');

// 初始化数据
const data = {
    lon: 113.403051,
    lat: 23.131432,
    location: {
        lon: 0,
        lat: 0
    },
    // markerList: [{
    //     iconPath: '/images/step.png',
    //     id: 1,
    //     latitude: 23.131432,
    //     longitude: 113.403051,
    //     width: 50,
    //     height: 50
    // }],
    markerList: [],
    storeList: []
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getLocation();
    // self.setData({
    //     markerList: 
    // })
};

// 页面onShow方法
const onShow = function(self) {

};

const onUnload = function(self) {

};

// 页面中的方法
const methods = {
    getLocation() {
        const self = this;
        _g.getLocation().then((res) => {
            self.setData({
                lon: res.longitude,
                lat: res.latitude
            });
            self.getStoreList(res);
        });
    },
    getStoreList() {
        const self = this;
        Store.storeList(self, {
            page: self.data.page,
            pageSize: 20,
            lon: self.data.longitude,
            lat: self.data.latitude
        }).then((ret) => {
            if (ret.data.list && ret.data.list.length) {
                if (self.data.page == 1) {
                    self.setData({
                        // lon: ret.data.list[0].lon,
                        // lat: ret.data.list[0].lat,
                        storeList: ret.data.list
                    });
                } else {
                    self.setData({
                        storeList: self.data.storeList.concat(ret.data.list)
                    });
                }
                self.setData({
                    page: ++self.data.page
                });
                self.transList();
            } else {
                if (self.data.page != 1) {
                    _g.toast({
                        title: '暂无更多数据'
                    });
                }
            }


        });
    },
    transList() {
        const self = this;
        self.setData({
            markerList: _.map(self.data.storeList, (item, index) => {
                item.latitude = item.lat;
                item.longitude = item.lon;
                return item;
            })
        })
    },
    onBubbleTap(e) {

    },
    bindupdated(e) {

    },
    bindregionchange(e) {

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