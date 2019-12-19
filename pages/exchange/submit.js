// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Exchange = require('../../service/Exchange');

let data = {
    remark: '',
    orderAddressVo: {},
    goodsList: [
        {
            imgUrl: "/upload/20191129_660e70eb-e78a-4570-94ec-7cdba6b54d23.jpg",
            title:'ggggg',
            specificationName: '一盒6个',
            num: 3
            
        },
    ],
    
};
const onLoad = function (self) {
   self.getData();
}
const onShow = function (self) {
    // self.getData();
 }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
    getData: function() {
        let self = this;
        self.preOrder();

    },
    preOrder: function () {
        const self = this;
        Exchange.preOrder(self, {
            awardId: self.data.awardId,
            addressId: self.data.orderAddressVo.id
        }).then((res) => {
            let data = res.data;
            self.setData({
                orderAddressVo: data.orderAddressVo,
                goodsList: data.goodsVoList,
                totalPrice: data.totalPrice,
                deliveryFee: data.deliveryFee,
                payPrice: data.payPrice,
                num: data.num
            })
        },(err) =>{})
    },
    placeOrder: function () {
        const self = this;
        Exchange.placeOrder(self, {
            awardId: self.data.awardId,
            addressId: self.data.orderAddressVo.id,
            remark: self.data.remark
        }).then((res) => {
            self.prePay(res.data);
        },(err) =>{})
    },
    prePay: function (opts) {
        const self = this;
        Exchange. prePay(self, {
            prizeOrderId: opts.prizeOrderId,
        }).then((res) => {
            let payInfo = res.data;
            if (opts.type == 1) {
                payInfo.success = function () {
                    //TODO check pay status
                    self.payStatus(opts.prizeOrderId);
                };
                payInfo.fail = function () {
                    _g.showModal({
                        title: '提示',
                        content: '支付失败',
                    });
                };
                _g.requestPayment(payInfo);

            } else if (opts.type == 2) {
                self.payStatus(opts.prizeOrderId);
            }
        },(err) =>{})
    },
    payStatus(id) {
        const self = this;
        _g.redirectTo({
            url: 'pages/exchange/exchangeOrderDetail',
            param: {
                prizeOrderId: id,
            }
        }, self);
        
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
    getInputValue: function (e) {
        let self = this;
        self.setData({
            remark: e.detail.value
        })
    },
    onSubmitTap: function () {
        const self = this;
        if (self.data.orderAddressVo.id == undefined) {
            _g.toast({
                title:'请选择收货地址',
                duration: 2000,
            });
            return;
        }
        self.placeOrder();
    }
    
}

const temps = {

}


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