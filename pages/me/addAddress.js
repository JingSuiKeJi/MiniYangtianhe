// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Region = require('../../res/Area');

let data = {
    set: false,
    name: '',
    tel: '',
    showAddress: '请选择地址',
    addressDetail: '',
    houseNumber: '',
    selectLocation: {
        lon: 0,
        lat: 0
    },
    provinceName: '',
    cityName: '',
    areaName: '',
    customItem: '全部',
    // 爱亲 获取 省市区: 
    changeDeep: 0,
    initRegion: Region,
    firstChange: false,
    provinceIndex: 0,
    cityIndex: 0,
    areaIndex: 0,
    confirmSelect: [0, 0, 0],
    // // 接口所需参数:
    // provinceId: '',
    // provinceName: '',
    // cityId: '',
    // cityName: '',
    // areaId: '',
    // areaName: '',
    title: '',
    addressList: {},
    authorizeHidden: true,
    id: 0,
    change: false,
};
const onLoad = function(self) {
    if (!_.isEmpty(self.data.addressList)) {
        const title = self.data.title;
        const addressList = self.data.addressList;
        const selectLocation = self.data.selectLocation;
        const newLon = "selectLocation.lon";
        const newLat = "selectLocation.lat";
        self.setData({
            title: title,
            addressList: addressList,
            name: addressList.receiverName,
            tel: addressList.receiverPhone,
            showAddress: addressList.showAddress,
            houseNumber: addressList.houseNumber,
            set: addressList.isDefault == 0 ? false : true,
            id: addressList.id,
            [newLon]: addressList.lon,
            [newLat]: addressList.lat,
            cityName: addressList.cityName,
            areaName: addressList.areaName,
            provinceName: addressList.provinceName,
            addressDetail: addressList.address,
            change: self.data.change,
        });
    }
}
const onShow = function(self) {}

const onReady = function(self) {
    self.authorize = self.selectComponent('#authorize');
    self.authorize.onCancelTap = function() {
        self.setData({
            authorizeHidden: true
        });
        self.rejectAuthLocation();
    }
    event.on('me-addAddress-authorize', self, function(e) {
        self.setData({
            authorizeHidden: true
        });
        if (e.detail.authSetting['scope.userLocation']) {
            //开启成功
            self.openMap();
        } else {
            //开启失败
            self.rejectAuthLocation();
        }

    });
}

const onUnload = function(self) {
    event.remove('me-addAddress-authorize');
}

const methods = {
    // 设置默认地址开关
    onSetTap: function() {
        const self = this;
        const set = !self.data.set;
        self.setData({
            set: set
        })
    },
    //双向绑定姓名
    onNameTap: function(e) {
        const self = this;
        self.setData({
            name: e.detail.value
        })
        console.log(e);
    },
    //双向绑定手机
    onTelTap: function(e) {
        const self = this;
        const tel = self.data.tel;
        self.setData({
            tel: e.detail.value
        })
    },
    //双向绑定区域
    onAreaTap: function(e) {
        const self = this;
        const area = self.data.area;
        self.setData({
            area: e.detail.value
        })
    },
    //选择区域
    onAreaSeletTap: function() {
        const self = this;
        console.log(1);
    },
    //双向绑定地址
    onAddressDetailTap: function(e) {
        const self = this;
        const houseNumber = self.data.houseNumber;
        self.setData({
            houseNumber: e.detail.value
        })
    },
    //三级选择器省市区
    bindRegionChange: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        console.log(e.detail);
        // console.log(e.detail.code);
        this.setData({
            region: e.detail.value,
            regionCode: e.detail.code
        })
    },
    //保存
    onSaveTap: function() {
        const self = this;
        const phoneReg = /^1[0-9]{10}$/;


        if (!self.data.selectLocation.lon) {
            _g.toast({
                title: '请选择地址'
            });
            return
        };

        if (!self.data.houseNumber) {
            _g.toast({
                title: '请输入门牌号'
            });
            return
        };

        if (!self.data.name.trim()) {
            _g.toast({
                title: '请输入姓名'
            });
            return
        }
        if (!self.data.tel.trim()) {
            _g.toast({
                title: '请输入手机号'
            });
            return
        }
        if (!phoneReg.test(self.data.tel)) {
            _g.toast({
                title: '请输入正确的手机号码'
            });
            return
        }

        if (!self.data.houseNumber.trim()) {
            _g.toast({
                title: '请输入详细地址'
            });
            return
        }
        // 接口: 新增/编辑收货地址
        if (self.data.change) {
            User.update(self, {
                id: self.data.id,
                receiverName: self.data.name,
                receiverPhone: self.data.tel,
                lon: self.data.lon,
                lat: self.data.lat,
                address: self.data.addressDetail,
                houseNumber: self.data.houseNumber,
                showAddress: self.data.showAddress,
                isDefault: self.data.set == false ? 0 : 1,
                provinceName: self.data.provinceName,
                cityName: self.data.cityName,
                areaName: self.data.areaName,
            }).then(function(ret) {
                self.setData({
                    change: false
                })
                _g.toast({
                    title: '编辑收货地址成功',
                    mask: true,
                    success() {
                        _g.navigateBack();
                    }
                });
            });
        } else {
            User.getAddressAdd(self, {
                receiverName: self.data.name,
                receiverPhone: self.data.tel,
                lon: self.data.selectLocation.lon,
                lat: self.data.selectLocation.lat,
                address: self.data.addressDetail,
                houseNumber: self.data.houseNumber,
                showAddress: self.data.showAddress,
                isDefault: self.data.set == false ? 0 : 1,
                provinceName: self.data.provinceName,
                cityName: self.data.cityName,
                areaName: self.data.areaName,
            }).then(function(ret) {
                _g.toast({
                    title: '添加收货地址成功',
                    mask: true,
                    success() {
                        _g.navigateBack();
                    }
                });
            });
        }
    },
    // getAddress(addId,addTitle){
    //  const self = this;
    //  User.getAddressAdd(self, {
    //      id:addId,
    //      receiverName: self.data.name,
    //      receiverPhone: self.data.tel,
    //      lon: self.data.selectLocation.lon,
    //      lat: self.data.selectLocation.lat,
    //      address: self.data.addressDetail,
    //      houseNumber: self.data.houseNumber,
    //      showAddress: self.data.showAddress,
    //      isDefault: self.data.set == false ? 0 : 1,
    //      provinceName: self.data.provinceName,
    //      cityName: self.data.cityName,
    //      areaName: self.data.areaName,
    //  }).then(function(ret) {
    //      _g.toast({
    //          title: 0?'新增成功':'编辑成功',
    //          mask: true,
    //          success() {
    //              _g.navigateBack();
    //          }
    //      });
    //  });
    // },
    // 微信 获取 经纬度:
    onMapTap() {
        const self = this;
        _g.getAuthorize({
            type: 'scope.userLocation'
        }, (ret) => {
            if (ret) {
                self.openMap();
            } else if (_.isUndefined(ret)) {
                self.openMap();
            } else {
                self.setData({
                    authorizeHidden: false
                });
            }
        });
    },
    openMap() {
        const self = this;
        wx.chooseLocation({
            success(ret) {
                self.setData({
                    showAddress: ret.name,
                    addressDetail: ret.address,
                    selectLocation: {
                        lon: ret.longitude,
                        lat: ret.latitude
                    }
                });
                _g.getLocationDetail(ret.longitude, ret.latitude).then((res) => {
                    self.setData({
                        provinceName: res.province,
                        cityName: res.city,
                        areaName: res.district
                    })
                }, (err) => {

                })
                // provinceName: '',
                // cityName: '',
                // areaName: '',
            },
            fail(err) {
                // self.setData({
                //     authorizeHidden: false
                // });
            }
        })
    },
    rejectAuthLocation() {
        _g.showModal({
            content: '请开启定位用于选择配送地址'
        });
    },
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