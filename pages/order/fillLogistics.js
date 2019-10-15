// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	expressCompany:'请选择',//选择快递公司
	companyList:['顺丰快递','申通快递','圆通快递','中通快递','韵达快递','百世汇通快递','EMS快递','宅急送快递','天天快递'],//快递公司列表
	refundOrderNum: '',//订单号
};
const onLoad = function(self) {
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function (e) {
		let self = this;
        self.logistics();
	},
	logistics:function () {
		let self = this;
		Order.logistics(self, {
			id: self.data.id
		}).then((ret) => {
			let data = ret.data;
			self.setData({
				list: data,
                companyList: data.logisticsCompanyList
			})
        }, (err) => {
			
        });	
	},
	subLogistics:function () {
		let self = this;
		Order.subLogistics(self, {
			id: self.data.id,
			logisticsCompany: self.data.expressCompany,
			logisticsNo: self.data.refundOrderNum
		}).then((ret) => {
			_g.toast({
				title: '已提交',
				mask: true,
				icon: 'success',
				duration:  1500
			});
			_g.navigateBack();
        }, (err) => {
			
        });	
	},
	//选择快递公司
	changeCompany:function(e){
		const self = this;
		// 快递公司索引第几个
		const index = e.detail.value;
		//当前选择公司
		self.setData({
			expressCompany:self.data.companyList[index],
			index: index
		});
	},
	// 双向绑定订单号
	onRefundOrderNum: function (e) {
		const self = this;
		self.setData({
		  refundOrderNum: e.detail.value
		})
	},
	//提交
	onSubmitTap:function(){
		let self = this;
		self.subLogistics();
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