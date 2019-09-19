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

    initTimes: [],
    dispatchingTime: {
        beignTime: 0,
        endTime: 0
    },

    location: {
        lon: 112.59000,
        lat: 28.12000
    },

    goodsList: [],
    postType: '请输入配送方式',
    type: -1,
    pickerValue: [0, 0],
    timeList: [
        // ['2019-07-25', '2019-07-26'],
        // ['12:00-13:00', '13:00-14:00']
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
    // if (self.data.platformFlag == 1) {
        self.preOrder();
    // } else {
    //     self.getLocation();
    // }
    if (self.data.platformFlag == 2) {
        self.getDeliveryTime();
    }
};

// 页面onShow方法
const onShow = function(self) {

};
const onUnload = function(self) {

}
// 页面中的方法
const methods = {
    getLocation() {
        const self = this;
        _g.getLocation().then((res) => {
            self.setData({
                location: {
                    lon: res.lon,
                    lat: res.lat
                }
            });
        }, (err) => {

        });
    },
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
                self.setPageData(ret.data);
            });
        } else if (self.data.from == 'cart') {
            Order.preOrderCart(self, {
                cartIds: self.data.postData.cartIds,
                platformFlag: self.data.platformFlag
            }).then((ret) => {
                self.setPageData(ret.data);
            });
        }
    },
    getDeliveryTime() {
        const self = this;
        Order.getDeliveryTime(self, {}).then((ret) => {
            let list = _.map(ret.data, (item) => {
                return  new Date(item.beignTime * 1000).Format('yyyy-MM-dd hh:mm') +
                         '-' + 
                         new Date(item.endTime * 1000).Format('yyyy-MM-dd hh:mm')
            });

            self.setData({
                timeList: list,
                initTimes: ret.data
            })
        }, (err) => {});
    },
    setPageData(data) {
        const self = this;
        self.setData({
            orderAddressVo: data.orderAddressVo,
            goodsVoList: data.goodsVoList,
            orderStoreVO: data.orderStoreVO,
            points: data.points || 0,
            totalPrice: data.totalPrice,
            num: data.num,
            deliveryTime: data.deliveryTime,
            deliveryRange: data.deliveryRange
        })
    },
    getData: function() {
    },
    onPostTap: function(e) {
        let self = this;
        let type = e.currentTarget.dataset.type;
        if (self.data.type == type) return;
        switch (type) {
            case '3':
                self.setData({
                    postType: '立即配送',
                    type: 3
                });
                break;
            case '4':
                self.setData({
                    postType: '预约配送',
                    type: 4
                });
                break;
            case '2':
                self.setData({
                    postType: '到店自取',
                    type: 2
                });
                break;
            default:
                break;
        }
    },
    onPickerTap: function(e) {
        let self = this;
        let pickerValue = e.detail.value;

        self.setData({
            postTime: self.data.timeList[pickerValue],
            dispatchingTime: {
                beignTime: self.data.initTimes[pickerValue].beignTime,
                endTime: self.data.initTimes[pickerValue].endTime,
            },
            pickerValue: pickerValue
        });
    },
    onSelectTap: function(e) {
        let self = this;
        if (!self.data.points) return;
        self.setData({
            isSelect: !self.data.isSelect
        })
    },
    payStatus(type, id) {
        const self = this;
        if (self.data.from == 'goodsDetail') {
            _g.redirectTo({
                url: 'pages/order/orderDetail',
                param: {
                    orderId: id,
                    from: 'submit'
                }
            }, self);
        } else {
            _g.redirectTo({
                url: 'pages/order/index',
            }, self);
        }
    },
    onSubmitTap: function(e) {
        const self = this;
        let data = {
            num: self.data.num,
            skuId: '',
            addressId: self.data.orderAddressVo.id,
            integralStatus: 2,
            dispatchingType: 1,
            remark: self.data.remark,
            platformFlag: self.data.platformFlag,
        };

        if (self.data.platformFlag == 2) {
            data.dispatchingType = self.data.type;
            data.dispatchingTime = self.data.dispatchingTime;
        }

        if (self.data.from == 'goodsDetail') {
            data.id = self.data.postData.id;
            data.buyType = 1;
        }
        if (self.data.from == 'cart') {
            data.cartIds = self.data.postData.cartIds;
            data.buyType = 2;
        }
        Order.placeOrder(self, data).then((ret) => {
            self.prePay(ret.data);
        }, (err) => {
            _g.showModal({
                content: '提交订单失败',
                confirm() {
                    _g.navigateBack();
                }
            })
        });
    },
    prePay(id) {
        const self = this;
        Order.prePay(self, {
            orderId: id
        }).then((ret)=>{
            let payInfo = ret.data;
            payInfo.success = function() {
                //TODO check pay status
                self.payStatus('success', id);
            };
            payInfo.fail = function() {
                _g.showModal({
                    title: '提示',
                    content: '支付失败',
                    confirm: function() {
                        self.payStatus('fail', id);
                    }
                });
            };
            _g.requestPayment(payInfo);
        },err=>{
            _g.showModal({
                title: '提示',
                content: '支付失败',
                confirm: function() {
                    self.payStatus('fail', id);
                    // _g.navigateBack();
                }
            });
        });
    },
    // onSkip(){
    //     const self = this;
    //     if (self.data.from == 'order') {};
    //     _g.redirectTo({
    //         url: 'pages/order/index',
    //         param: {
    //             index: 0,
    //             from: 'submit'
    //         }
    //     }, self);
    // },
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