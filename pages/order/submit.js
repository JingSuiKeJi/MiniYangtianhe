// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Order = require('../../service/Order');

// 初始化数据
const data = {
    orderAddressVo: {},
    goodsVoList: [],
    orderStoreVO: {},
    points: 0,
    totalPrice: 0,
    num: '',
    deliveryTime: '',
    deliveryRange: '',


    goodsList: [],
    postType: '请输入配送方式',
    type: -1,
    pickerValue: [0, 0],
    timeList: [
        ['2019-07-25', '2019-07-26'],
        ['12:00-13:00', '13:00-14:00']
    ],
    postTime: '请选择配送时间',
    infoList: [],
    pointsFlag: true, //有积分可用
    flag: true, //有优惠卷可用,
    isSelect: false, //是否使用积分
    remark: '',
    // points: 148, //可用积分
    num: 0, //商品总数
    totalPrice: 22, //总价
};

// 页面onLoad方法
const onLoad = function(self) {
    self.setData({
        platformFlag: self.data.platformFlag
    })
    if (self.data.platformFlag == 1) {
        self.preOrder();
    } else {
        self.getLocation();
    }
};

// 页面onShow方法
const onShow = function(self) {

};
const onUnload = function(self) {

}
// 页面中的方法
const methods = {
    preOrder() {
        const self = this;
        if (self.data.from == 'goodsDetail') {
            let postData = self.data.postData;
            let data = {
                preGoods: {
                    goodsId: postData.id,
                    num: postData.num,
                },
                platformFlag: postData.platformFlag
            };
            if (postData.skuId) data.preGoods.skuId = postData.skuId;
            Order.preOrder(self, data).then((ret) => {
                self.setData({
                    orderAddressVo: ret.data.orderAddressVo,
                    goodsVoList: ret.data.goodsVoList,
                    orderStoreVO: ret.data.orderStoreVO,
                    points: ret.data.points || 0,
                    totalPrice: ret.data.totalPrice,
                    num: ret.data.num,
                    deliveryTime: ret.data.deliveryTime,
                    deliveryRange: ret.data.deliveryRange
                })
            });
        } else if (self.data.from == 'cart') {

        }
    },
    getData: function() {
        // let self = this;
        // let param = {
        //     platformFlag: self.data.platformFlag,
        //     preGoods: {
        //         goodsId: self.data.id,
        //         skuId: self.data.skuId,
        //         num: self.data.num
        //     }
        // }
        // if (self.data.platformFlag == 2) {
        //     _g.getLocation(self).then((data) => {
        //         self.setData({
        //             lat: data.latitude,
        //             lon: data.longitude
        //         })
        //     });
        //     param.lat = self.data.latitude;
        //     param.lon = self.data.longitude;
        // }
        // Order.common(self, param).then((ret) => {
        //     let data = ret;
        //     let dataObj = {
        //         infoList: data.orderAddressVo,
        //         goodsList: data.goodsVoList,
        //         points: data.points,
        //         num: data.num,
        //         totalPrice: data.totalPrice,
        //     }
        //     if (data.orderStoreVO.length) {
        //         dataObj.orderStoreVO = data.orderStoreVO
        //     }
        //     self.setData(param);
        // }, (err) => {

        // });
    },
    onPostTap: function(e) {
        let self = this;
        let type = e.target.dataset.type;
        if (self.data.type == type) return;
        switch (type) {
            case '1':
                self.setData({
                    postType: '立即配送',
                    type: 1
                });
                break;
            case '2':
                self.setData({
                    postType: '预约配送',
                    type: 2
                });
                break;
            case '3':
                self.setData({
                    postType: '到店自取',
                    type: 3
                });
                break;
            default:
                break;
        }
    },
    onPickerTap: function(e) {
        let self = this;
        let pickerValue = e.detail.value;
        let postTime = self.data.timeList[0][pickerValue[0]] + self.data.timeList[1][pickerValue[1]]
        this.setData({
            pickerValue: pickerValue,
            postTime: postTime
        })
    },
    onSelectTap: function(e) {
        let self = this;
        if (!self.data.points) return;
        self.setData({
            isSelect: !self.data.isSelect
        })
    },
    payStatus(type) {
        const self = this;
        if (type == 'success') {
            _g.redirectTo({
                url: 'pages/order/orderDetail',
                param: {
                    index: 0,
                    from: 'submit'
                }
            }, self);
        } else {
            //fail
            _g.redirectTo({
                url: 'pages/order/orderDetail',
                param: {
                    index: 0,
                    from: 'submit'
                }
            }, self);
        }
    },
    onSubmitTap: function(e) {
        const self = this;
        let data = {
            id: self.data.postData.id,
            num: self.data.num,
            skuId: '',
            addressId: self.data.orderAddressVo.id,
            integralStatus: 2,
            dispatchingType: 1,
            remark: '',
            platformFlag: self.data.platformFlag,
            buyType: 1
        };

        Order.placeOrder(self, data).then((ret) => {
            if (self.data.from == 'goodsDetail') {
                //TODO pay
                self.payStatus('success');
            } else {
                //
            }
        }, (err) => {
            _g.showModal({
                content: '提交订单失败',
                confirm() {
                    _g.navigateBack();
                }
            })
        });
    },
    getInputValue: function(e) {
        let self = this;
        self.setData({
            remark: e.detail.value
        })
    },
    onAddressTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/myAddress',
            param: {
                from: 'order'
            }
        }, self);
    }
}

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