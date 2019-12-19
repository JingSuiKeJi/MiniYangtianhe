// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Exchange = require('../../service/Exchange');
const Order = require('../../service/Order');

let data = {
    list: [],
    showLogistics:false,
    deliveryStatus: [],//物流轨迹
    
};
const onLoad = function (self) {
      self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
    getData: function() {
        let self = this;
        self.prizeOrderDetail();

    },
    prizeOrderDetail: function () {
        const self = this;
        Exchange.prizeOrderDetail(self, {
            prizeOrderId: self.data.prizeOrderId
        }).then((res) => {
            let data = res.data;
            self.setData({
                info: data,
                orderAddress: data.orderAddress,
                list: data.orderGoodsVoList,
                status: data.status,
            })
        },(err) =>{})
    },
    //物流接口
    prizeOrderTraces: function () {
        const self = this;
        Exchange.prizeOrderTraces(self, {
            prizeOrderId: self.data.prizeOrderId
        }).then((res) => {
            let data = res.data;
            self.setData({
                deliveryStatus: data.traces
            })
        },(err) =>{})
    },
    //查看物流
	onShowModal:function(){
        let self = this;
        self.prizeOrderTraces();
		self.setData({
		  showLogistics: true
		});
	},
	onHideModal: function () {
		let self = this;
		self.setData({
		  showLogistics: false
		});
	},
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