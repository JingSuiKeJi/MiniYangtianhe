// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	expressCompany:'请选择',//选择快递公司
	companyList:['顺丰快递','申通快递','圆通快递','中通快递','韵达快递','百世汇通快递','EMS快递','宅急送快递','天天快递'],//快递公司列表
	companyIndex:6,//默认第一个快递
	refundOrderNum:'',//订单号
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//选择快递公司
	changeCompany:function(e){
		const self = this;
		// 快递公司索引第几个
		const expressIndex = e.detail.value;
		//当前选择公司
		const expressCompany =  self.data.companyList[expressIndex];
		self.setData({
			expressCompany:expressCompany
		});
	},
	// 双向绑定订单号
	onRefundOrderNum: function (e) {
		const self = this;
		const refundOrderNum = self.data.refundOrderNum;
		self.setData({
		  refundOrderNum: e.detail.value
		})
	},
	//提交
	onSubmitTap:function(){
		let self = this;
		wx.showToast({
			title: '已提交',
			icon: 'success',
			duration: 1500,
			mask: true,
			success:function(){
				setTimeout(function(){
					self.setData({
						expressCompany:'请选择',
						refundOrderNum:''
					});
				},1500)
			},
		})
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