// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Order = require('../../service/Order');
const event = app.event;
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
    type: 1,
    pickerValue: [0, 0],
    timeList: [
        // ['2019-07-25', '2019-07-26'],
        // ['12:00-13:00', '13:00-14:00']
    ],
    postTime: '请选择配送时间',
    infoList: [],
    pointsFlag: false, //有积分可用
    remark: '',
    // points: 148, //可用积分
    num: 0, //商品总数
    totalPrice: 22, //总价
    couponId: 0,
    count: 0
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        platformFlag: self.data.platformFlag,
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    });
    self.preOrder();
    if (self.data.platformFlag == 2 && !self.data.isDisabledReservation) {
        self.getDeliveryTime();
    }
    event.on('preferentialPolicies', self, () => {
        self.preferentialPolicies();
    })
};

// 页面onShow方法
const onShow = function (self) {
    self.setData({
        couponId: self.data.couponId,
        preGodosReqs: self.data.preGodosReqs,
        platformFlag: self.data.platformFlag,
    });
    // self.preferentialPolicies();
};
const onUnload = function (self) {
    event.remove('preferentialPolicies', self);
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
        if (self.data.from == 'cart') {
            Order.preOrderCart(self, {
                cartIds: self.data.postData.cartIds,
                platformFlag: self.data.platformFlag
            }).then((ret) => {
                self.setPageData(ret.data);
                self.getGoodsInfo(ret.data.goodsVoList);
            }, (err) => {
                _g.showModal({
                    content: err.message,
                    confirm() {
                        _g.navigateBack();
                    }
                })
                // if (err.code == 40001) {
                //     _g.toast({
                //         title: err.message,
                //     });
                //     setTimeout(() => {
                //         _g.navigateBack();
                //     }, 2000)
                // }

            });

        } else {
            let postData = self.data.postData;
            let data = {
                preGoods: {
                    goodsId: postData.id,
                    num: postData.num,
                },
                platformFlag: postData.platformFlag
            };
            if (postData.isOrigPrice) data.preGoods.isOrigPrice = postData.isOrigPrice;
            if (postData.skuId) data.preGoods.skuId = postData.skuId;
            Order.preOrder(self, data).then((ret) => {
                self.setPageData(ret.data);
                self.getGoodsInfo(ret.data.goodsVoList);
            }, (err) => {
                _g.showModal({
                    content: err.message,
                    confirm() {
                        _g.navigateBack();
                    }
                })
                // if (err.code == 40001) {
                //     _g.toast({
                //         title: err.message,
                //     });
                //     setTimeout(() => {
                //         _g.navigateBack();
                //     }, 2000)
                // }
            });
        }
    },

    preferentialPolicies: function () {
        let self = this;
        let param = {
            couponId: self.data.couponId,
            preGodosReqs: self.data.preGodosReqs,
            platformFlag: self.data.platformFlag,
            addressId: self.data.orderAddressVo.id,
            deliveryType: self.data.type
        }
        if (self.data.pointsFlag) {
            param.integralStatus = 1;
        } else {
            param.integralStatus = 2;
        }
        Order.preferentialPolicies(self, param).then((ret) => {
            self.setPageData(ret.data);
        });
    },
    getDeliveryTime() {
        const self = this;
        Order.getDeliveryTime(self, {}).then((ret) => {
            let list = _.map(ret.data, (item) => {
                return new Date(item.beignTime * 1000).Format('yyyy-MM-dd hh:mm') +
                    '-' +
                    new Date(item.endTime * 1000).Format(' hh:mm')
            });

            self.setData({
                timeList: list,
                initTimes: ret.data
            })
        }, (err) => { });
    },
    setPageData(data) {
        const self = this;
        let option = {
            orderAddressVo: data.orderAddressVo,
            goodsVoList: data.goodsVoList,
            orderStoreVO: data.orderStoreVO,
            points: data.points || 0,
            totalPrice: data.totalPrice,
            num: data.num,
            deliveryTime: data.deliveryTime,
            deliveryRange: data.deliveryRange,
            couponNum: data.couponNum,
            payPrice: data.payPrice,
            pointsPrice: data.pointsPrice,
            deductionStatus: data.deductionStatus,
            couponId: data.couponId,
            couponPrice: data.couponPrice,
            integralStatus: data.integralStatus,
            deliveryFee: data.deliveryFee,
            isDisabledImmediate: data.isDisabledImmediate,
            isDisabledReservation: data.isDisabledReservation,
            isDisabledSelf: data.isDisabledSelf,
        }
        //显示积分开关
        if (data.integralStatus == 1) {
            option.pointsFlag = true;
        } else if (data.integralStatus == 2) {
            option.pointsFlag = false;
        }
        self.setData(option);
    },
    getData: function () {
    },
    onPostTap: function (e) {
        let self = this;
        let type = e.currentTarget.dataset.type;
        if (self.data.type == type) return;
        if (!self.data.orderAddressVo) {
            _g.toast({
                title: '请先选择地址'
            })
            return;
        }
        switch (type) {
            case '3':
                self.setData({
                    postType: '立即配送',
                    type: 3
                });
                self.preferentialPolicies();
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
                self.preferentialPolicies();
                break;
            default:
                break;
        }
    },
    onPickerTap: function (e) {
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
        self.preferentialPolicies();
    },
    onSelectTap: function (e) {
        let self = this;
        if (!self.data.points) return;
        self.setData({
            pointsFlag: !self.data.pointsFlag
        });
        self.preferentialPolicies();
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
    onSubmitTap: function (e) {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        if (!self.data.orderAddressVo) {
            _g.toast({
                title: '请先选择地址'
            })
            return;
        }
        if (self.data.platformFlag == 2 && self.data.type == 1) {
            _g.toast({
                title: '请选择配送方式'
            });
            return;
        }
        if (self.data.platformFlag == 2 && !self.data.orderAddressVo.isDelivery && self.data.type != 2) {
            _g.toast({
                title: `您选择的地址超过门店配送${self.data.orderAddressVo.betweenDistance}km的范围,请更换配送地址或选择到店自提`,
                duration: 3000

            });
            return;
        }
        if (self.data.points && !userInfo.phone && self.data.pointsFlag) {
            wx.showModal({
                content: '您当前还没绑定手机号,去绑定手机号？',
                confirmText: '确定',
                cancelText: '取消',
                confirmColor: '#20CAB4',
                success(res) {
                    if (res.confirm) {
                        _g.navigateTo({
                            url: 'pages/me/bindingPhone'
                        }, self)
                    }
                }
            })
            return;
        }
        let data = {
            num: self.data.num,
            skuId: 0,//暂时传0
            addressId: self.data.orderAddressVo.id,
            integralStatus: 2,
            dispatchingType: 1,
            remark: self.data.remark,
            platformFlag: self.data.platformFlag,
            couponId: self.data.couponId,
        };
        if (self.data.platformFlag == 2) {
            data.dispatchingType = self.data.type;
            data.dispatchingTime = self.data.dispatchingTime;
        }
        if (self.data.from == 'cart') {
            data.cartIds = self.data.postData.cartIds;
            data.buyType = 2;
        } else {
            data.id = self.data.postData.id;
            data.buyType = 1;
        }
        if (self.data.postData.thirdId) {
            data.thirdId = self.data.postData.thirdId;
        }
        if (self.data.postData.isJoin) {
            data.isJoin = self.data.postData.isJoin;
        }
        if (self.data.postData.isOrigPrice) {
            data.isOrigPrice = self.data.postData.isOrigPrice;
        }
        data.integralStatus = self.data.pointsFlag ? 1 : 2;
        Order.placeOrder(self, data).then((ret) => {
            //需要做订单轮巡的
            // self.checkOrderStatus(ret.data);
            // 不做订单轮巡的
            self.prePay(ret.data);
        }, (err) => {
            _g.showModal({
                content: err.message,
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
        }).then((ret) => {
            let payInfo = ret.data;
            if (payInfo.type == 1) {
                payInfo.success = function () {
                    //TODO check pay status
                    self.payStatus('success', id);
                };
                payInfo.fail = function () {
                    _g.showModal({
                        title: '提示',
                        content: '支付失败',
                        confirm: function () {
                            self.payStatus('fail', id);
                        }
                    });
                };
                _g.requestPayment(payInfo);

            } else if (payInfo.type == 2) {
                self.payStatus('success', id);
            }
        }, err => {
            _g.showModal({
                title: '提示',
                content: '支付失败',
                confirm: function () {
                    self.payStatus('fail', id);
                    // _g.navigateBack();
                }
            });
        });
    },
    checkOrderStatus: function (code) {
        let self = this;
        let count = 0;
        let timer = setInterval(() => {
            count++;
            Order.checkPlaceOrder(self, {
                code: code
            }).then(function (ret) {
                // self.stopCheck();
                if (ret.data.status == 2) {
                    self.prePay(ret.data.orderId);
                    clearInterval(timer);
                } else if (ret.data.status == 3) {
                    _g.showModal({
                        content: '提交订单失败',
                    })
                    clearInterval(timer);
                } else {
                    self.stopCheck(count);
                }
            }, function (error) {
                clearInterval(timer);
                _g.logErrorMsg(error);
            });
        }, 500);
        self.setData({
            timer: timer
        })
    },
    stopCheck: function (count) {
        let self = this;
        // console.log(count);
        if (count >= 10) {
            clearInterval(self.data.timer);
            _g.showModal({
                content: '提交订单失败',
            });

        }
    },
    getInputValue: function (e) {
        let self = this;
        self.setData({
            remark: e.detail.value
        })
    },
    onAddressTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/myAddress',
            param: {
                from: 'order'
            }
        }, self);
    },
    onChoseCoupon: function (e) {
        let self = this;
        if (!self.data.couponNum) return;
        _g.navigateTo({
            url: 'pages/pharmacy/discounts',
            param: {
                from: 'submit',
                preGodosReqs: self.data.preGodosReqs,
                platformFlag: self.data.platformFlag,

            }
        }, self)
    },
    getGoodsInfo: function (data) {
        let self = this;
        let preGodosReqs = [];
        _.each(data, (item) => {
            preGodosReqs.push({
                goodsId: item.goodsId,
                kuId: 0,//没有规格时暂时传0
                num: item.num
            })
        });
        self.setData({
            preGodosReqs: preGodosReqs
        })
    },
    onCardRight: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/card/card',
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