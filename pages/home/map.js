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
    storeInfo: {},
    // markerList: [{
    //     iconPath: '/images/mapIcon.png',
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
    self.setData({
        storeInfo: _g.getLS('storeInfo')
    })
    self.getLocation();
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
                lon: res.lon,
                lat: res.lat
            });
            self.getStoreList(res);
        });
    },
    getStoreList() {
        const self = this;
        Store.storeList(self, {
            page: self.data.page,
            pageSize: 20,
            lon: self.data.lon,
            lat: self.data.lat
        }).then((ret) => {
            if (ret.data.list && ret.data.list.length) {
                if (self.data.page == 1) {
                    self.setData({
                        lon: ret.data.list[0].lon,
                        lat: ret.data.list[0].lat,
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
                item.iconPath = '/images/mapIcon.png';
                // item.id = index;
                return item;
            })
        });
    },
    onBubbleTap(e) {
    },
    bindupdated(e) {

    },
    bindregionchange(e) {

    },
    onStoreTap(e) {
        const self = this;
        const opts = e.currentTarget.dataset;
        const storeInfo = self.data.storeList[opts.index];
        
        if (!_g.checkLogin({
            type: 1
        })) {
            _g.setLS('storeInfo', storeInfo);
            event.emit('refreshHomeData');
            _g.navigateBack();
        } else {
            self.setStore(storeInfo);
        }
    },
    setStore(storeInfo) {
        const self = this;
        Store.selectStore(self, {
            selectStoreId: storeInfo.id,
            lon: self.data.lon,
            lat: self.data.lat,
        }).then((ret)=>{
            _g.getMyInfo(self, {
                suc() {
                    event.emit('refreshHomeData');
                    _g.navigateBack();
                }
            })
        });
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