// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
    photo: '', //照片地址
    auto_height: true, //当textarea获取焦点时自适应高度，失去焦点时不自适应高度 //自适应高度时，style中的height无效
    introduce: '', //门店介绍
    encoding: '', //门店编码
    storeName: '', //门店名称
    storeTel: '', //门店电话
    businessLicense: '', //营业执照
    company: '', //分公司
    companyId: '', //分公司Id
    authorizeHidden: true, //开启地理授权
    showModal: false, //选择公司模态框,
    list: [], //分公司列表
    lon: '',
    lat: '',
    provinceName: '',
    cityName: '',
    areaName: '',
    address: '', //choose Location 返回的详细地址
    showAddress: '',//choose Location 返回的name
    houseNumber: '', //详细地址
};
const onLoad = function(self) {
    self.getData();
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
    event.on('me-storeApplication-authorize', self, function(e) {
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
    event.remove('me-storeApplication-authorize');
}
const methods = {
    getData: function() {
        const self = this;
        User.getCompanyList(self, {
            page: 1,
            pageSize: 15,
        }).then((ret) => {
            let list = ret.data.list;
            self.setData({
                list: list
            })
        }, (err) => {
            console.log("获取失败");
        });
    },
    //上传本地图片或拍照
    onChooseImageTap: function() {
        const self = this;
        // wx.chooseImage({
        // 	count: 1,
        // 	sizeType: ['original', 'compressed'],
        // 	sourceType: ['album', 'camera'],
        // 	success (res) {
        // 		// tempFilePath可以作为img标签的src属性显示图片
        // 		const tempFilePaths = res.tempFilePaths
        // 		self.setData({
        // 			tempFilePaths:tempFilePaths
        // 		})
        // 	}
        // })
        _g.chooseImage({
            success: function(ret) {
                _g.onUpload({
                    imageList: ret.tempFilePaths,
                    success: function(ret) {
                        self.setData({
                            photo: ret[0]
                        });
                    }
                });
            }
        });
    },
    //失去焦点
    areablur: function() {
        const self = this;
        self.setData({
            auto_height: false
        })
    },
    //获取焦点
    areafocus: function() {
        const self = this;
        self.setData({
            auto_height: true
        })
    },
    //双向绑定门店介绍
    onIntroduceTap: function(e) {
        const self = this;
        // const introduce = self.data.introduce;
        self.setData({
            introduce: e.detail.value
        })
    },
    //双向绑定门店编码
    onEncodingTap: function(e) {
        const self = this;
        const encoding = self.data.encoding;
        self.setData({
            encoding: e.detail.value
        })
    },
    //双向绑定门店名称
    onStoreNameTap: function(e) {
        const self = this;
        const storeName = self.data.storeName;
        self.setData({
            storeName: e.detail.value
        })
    },
    //双向绑定地址信息
    onAddressTap: function(e) {
        const self = this;
        // const address = self.data.address;
        self.setData({
            houseNumber: e.detail.value
        })
    },
    //双向绑定联系电话
    onStoreTelTap: function(e) {
        const self = this;
        const storeTel = self.data.storeTel;
        self.setData({
            storeTel: e.detail.value
        })
    },
    //双向绑定营业执照
    onBusinessLicenseTap: function(e) {
        const self = this;
        const businessLicense = self.data.businessLicense;
        self.setData({
            businessLicense: e.detail.value
        })
    },
    //双向绑定分公司
    onCompanyTap: function(e) {
        const self = this;
        const company = self.data.company;
        self.setData({
            company: e.detail.value,
        })
    },
    //选择公司模态框
    showDialogBtn: function() {
        this.setData({
            showModal: true
        })
    },
    hideModal: function() {
        this.setData({
            showModal: false
        });
    },
    //选择公司
    onConfirm: function(options) {
        const self = this;
        const company = options.currentTarget.dataset.company;
        const companyId = self.data.companyId;
        let id = options.currentTarget.dataset.id
        self.setData({
            company: company,
            companyId: id,
        })
        this.hideModal(companyId);
    },
	//提现完善门店信息
	onNotSubmitTap:function(){
		_g.toast({
			title: '请按要求完善门店信息'
		});
	},
    //门店信息填写完成并提交申请
    onSubmitTap: function() {
        const self = this;
        const phoneReg = /^1[0-9]{10}$/;

        if (!phoneReg.test(self.data.storeTel)) {
            _g.toast({
                title: '请输入正确的手机号码'
            });
            return
        };
        const  data = {
            lon: self.data.lon,
            lat: self.data.lat,
            photo: self.data.photo,
            introduce: self.data.introduce,
            encoding: self.data.encoding,
            storeName: self.data.storeName,
            storeTel: self.data.storeTel,
            businessLicense: self.data.businessLicense,
            company: self.data.company,
            companyId: self.data.companyId,
            provinceName: self.data.provinceName,
            cityName: self.data.cityName,
            areaName: self.data.areaName,
            houseNumber: self.data.houseNumber,
            address: self.data.address,
            showAddress: self.data.showAddress,
        };
        
        User.apply(self, data).then((ret) => {
            _g.showModal({
                content: '提交成功',
                confirm() {
                    _g.navigateBack();
                }
            });
        }, (err) => {
            _g.showModal({
                content: '提交失败,请重试!',
            });
        });
    },
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
                const lon = ret.longitude;
                const lat = ret.latitude;
                _g.getLocationDetail(lon, lat).then((res) =>{
                    self.setData({
                        provinceName: res.province,
                        cityName: res.city,
                        areaName: res.district ? res.district : res.city,
                        lon: lon,
                        lat: lat,
                        address: ret.address,
                        showAddress: ret.name
                    })
                },(err) => {
                    _g.toast('请重新选择');
                })
                
            },
            fail(err) {
                self.setData({
                    authorizeHidden: false
                });
            }
        })
    },
    rejectAuthLocation() {
        _g.showModal({
            content: '请开启定位用于选择配送地址'
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