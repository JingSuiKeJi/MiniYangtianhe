
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Order = require('../../service/Order');
// 初始化数据
const data = {
    goodsList: [],
    postType: '请输入配送方式',
    type: -1,
    pickerValue: [0, 0],
    timeList: [['2019-07-25', '2019-07-26'], ['12:00-13:00', '13:00-14:00']],
    postTime: '请选择配送时间',
    infoList: [],
    pointsFlag: true,//有积分可用
    flag: true,//有优惠卷可用,
    isSelect: false,//是否使用积分
    remark: '',
    points: 148,//可用积分
    num: 0,//商品总数
    totalPrice: 22,//总价
    addressId: 0,
};

// 页面onLoad方法
const onLoad = function (self) {
    let data = {
        platformFlag: self.data.platformFlag,
        id: self.data.id,
        num: self.data.num,
        skuId: self.data.skuId,
        orderStatus: self.data.orderStatus,
        buyType: self.data.buyType
    }
    if (self.data.thirdId) {
        data.thirdId = self.data.thirdId
    }
    self.setData(data)
    // self.getData();
};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload = function (self) {

}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        let param = {
            platformFlag: self.data.platformFlag,
            preGoods: {
                goodsId: self.data.id,
                skuId: self.data.skuId,
                num:self.data.num
            } 
        }
        if (self.data.platformFlag == 2) {
            _g.getLocation(self).then((data)=>{
                self.setData({
                    lat: data.latitude,
                    lon: data.longitude
                })
            });
            param.lat =self.data.latitude;
            param.lon =self.data.longitude;
        }
        Order.common(self, param).then((ret) => {
            let data = ret;
            let dataObj = {
                infoList: data.orderAddressVo,
                goodsList: data.goodsVoList,
                points: data.points,
                num: data.num,
                totalPrice: data.totalPrice,
            }
            if (data.orderStoreVO.length) {
                dataObj.orderStoreVO = data.orderStoreVO
            }
            self.setData(param);
        }, (err) => {

        });
    },
    onPostTap: function (e) {
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
    onPickerTap: function (e) {
        let self = this;
        let pickerValue = e.detail.value;
        let postTime = self.data.timeList[0][pickerValue[0]] + self.data.timeList[1][pickerValue[1]]
        this.setData({
            pickerValue: pickerValue,
            postTime: postTime
        })
    },
    onSelectTap: function (e) {
        let self = this;
        if (!self.data.points) return;
        self.setData({
            isSelect: !self.data.isSelect
        })
    },
    onSubmitTap: function (e) {
        let self = this;
        let opts = self.data;
        let param = {
            platformFlag: opts.platformFlag,
            goodsId: opts.id,
            skuId: opts.skuId,
            num: opts.num,
            orderStatus: opts.orderStatus,
            remark: opts.remark,
            buyType: opts.buyType
        }
        if (self.data.thirdId) {
            param.thirdId = opts.thirdId;
        }
        if (opts.isSelect) {
            param.integralStatus = 1;
        }else {
            param.integralStatus = 2;
        }
        if (opts.platformFlag == 2) {
            param.dispatchingType = opts.type;
            if (opts.type == 2) {
                param.dispatchingTime = {
                    beginTime:1561634,
                    endTime:1561634
                }
            }
        }
        Order.placeOrder(self, param).then((ret) => {
            let data = ret;
        }, (err) => {

        });
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