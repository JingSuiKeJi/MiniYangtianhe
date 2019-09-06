// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	status:'申请退款',//上一个页面状态//默认申请退款//申请退款、申请退货、申请换货
	storeList:[//商品列表
		{newsImg:'my_ce',newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:'99.00'},
	],
	notCargo:true,//未收到货
	cargo:false,//一收到货
	showAfterModal:false,//选择售后原因模态框
	reasonFlag:'',//选择当前售后原因
	reasonTransfer:'',// 中转存
	selectFinish:false,//确认选择
	refundList:[
		{reason:'包装损坏',reasonFlag:'1'},
		{reason:'不想要了',reasonFlag:'2'},
		{reason:'实物和商品不符',reasonFlag:'3'},
		{reason:'我要换货',reasonFlag:'4'},
		{reason:'各种不符',reasonFlag:'5'},
		{reason:'其它',reasonFlag:'6'},
	],
	refundText:'',//售后原因
	explainText:'',//退款说明
	tempFilePaths:[],//本地照片地址
	showModal:false,//提交订单
};
const onLoad = function(self) {
	//接收上一个页面状态
	const status = self.data.status;
	self.setData({
		status:status
	})
	//动态修改导航栏名称 
	wx.setNavigationBarTitle({
		title: status,
	}) 
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//未收到货
	onNotCargoTap:function(){
		const self = this;
		self.setData({
		  notCargo:true,
		  cargo:false,
		})
	},
	//已收到货
	onCargoTap:function(){
		const self = this;
		self.setData({
		  cargo:true,
		  notCargo:false,
		})
	},
	//退款说明//失去焦点
	areablur:function(){
		const self = this;
		self.setData({
		  auto_height:false
		})
	},
	//退款说明//获取焦点
	areafocus:function(){
		const self = this;
		self.setData({
		  auto_height: true
		})
	},
	//退款说明内容双向绑定
	onExplainTap:function(e){
		const self = this;
		const explainText = self.data.explainText;
		self.setData({
			explainText: e.detail.value
		})
	},
	//添加照片
	onChooseImgTap:function () {
		let self = this;  
		wx.chooseImage({  
			count: 6, // 默认9  
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
			success: function (res) {  
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
				const newTemp = res.tempFilePaths;
				const tempFilePaths = self.data.tempFilePaths
				newTemp.forEach(function(val){
					tempFilePaths.push(val)
				})
				self.setData({  
					tempFilePaths:tempFilePaths
				})
			}  
		})
	},
	//删除照片
	onDeletePicTap:function(options){
		const self = this;
		const id = options.currentTarget.dataset.id;
		const tempFilePaths = self.data.tempFilePaths
		//删除
		tempFilePaths.splice(id,1);
		self.setData({  
			tempFilePaths:tempFilePaths
		})
	},
	//售后原因
	showAfterDialogBtn: function () {
		this.setData({
		  showAfterModal: true
		})
	},
	hideAfterModal: function () {
		let self = this;
		self.setData({
			reasonFlag:'',
		})
		self.setData({
		  showAfterModal: false
		});
	},
	//确认选择售后原因
	onAfterConfirm: function () {
		let self = this;
		// 当前是否确认
		let reasonTransfer = self.data.reasonTransfer;
		self.setData({
			refundText:reasonTransfer,
		})
		self.hideAfterModal()
	},
	//选择售后原因
	onSelectReasonTap:function(options){
		let self = this;
		//当前索引
		let id = options.currentTarget.dataset.id;
		//当前选择
		let selectReasonFlag = self.data.refundList[id].reasonFlag;
		// 当前原因
		let reason = options.currentTarget.dataset.reason;
		//选择原因
		self.setData({
			reasonFlag:selectReasonFlag
		})
		//选择原因存入中转reasonTransfer
		self.setData({
			reasonTransfer:reason,
		})
	},
	//提交模态框
	showDialogBtn: function () {
		this.setData({
		  showModal: true
		})
	},
	hideModal: function () {
		this.setData({
		  showModal: false
		});
	},
	onCancel: function () {
		this.hideModal();
	},
	//提交售后申请
	onConfirm: function () {
		let self = this;
		const status = self.data.status;
	    _g.navigateTo({
			param:{
				status:status
         	},
			url: 'pages/order/afterDetails',
	    }, self);
		self.hideModal();
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