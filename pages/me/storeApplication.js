// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	auto_height:true,//当textarea获取焦点时自适应高度，失去焦点时不自适应高度 //自适应高度时，style中的height无效
	introduce:'',//门店介绍
	tempFilePaths:'',//照片地址
	encoding:'',//门店编码
	address:'',//门店地址
	storeName:'',//门店名称
	storeTel:'',//门店电话
	businessLicense:'',//营业执照
	company:'',//公司
	showModal: false,//选择公司模态框,
	companyList:[
		{companyItem:"广州京穗科技有限公司"},
		{companyItem:"广州上单科技有限公司"},
		{companyItem:"广州刷新科技有限公司"},
		{companyItem:"广州按时科技有限公司"},
		{companyItem:"广州请问科技有限公司"},
		{companyItem:"广州二位科技有限公司"},
		{companyItem:"广州就就科技有限公司"},
		{companyItem:"广州光辉科技有限公司"},
		{companyItem:"广州就好科技有限公司"},
		{companyItem:"广州别扭科技有限公司"}
	]
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//上传本地图片或拍照
	onChooseImageTap:function(){
		const self = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				self.setData({
					tempFilePaths:tempFilePaths
				})
			}
		})
	},
	//失去焦点
	areablur:function(){
		const self = this;
		self.setData({
		  auto_height:false
		})
	},
	//获取焦点
	areafocus:function(){
		const self = this;
		self.setData({
		  auto_height: true
		})
	},
	//双向绑定门店介绍
	onIntroduceTap: function (e) {
	  const self = this;
	  const introduce = self.data.introduce;
	  self.setData({
	    introduce: e.detail.value
	  })
	},
	//双向绑定门店编码
	onEncodingTap: function (e) {
	  const self = this;
	  const encoding = self.data.encoding;
	  self.setData({
	    encoding: e.detail.value
	  })
	},
	//双向绑定门店名称
	onStoreNameTap: function (e) {
	  const self = this;
	  const storeName = self.data.storeName;
	  self.setData({
	    storeName: e.detail.value
	  })
	},
	//双向绑定地址信息
	onAddressTap: function (e) {
	  const self = this;
	  const address = self.data.address;
	  self.setData({
	    address: e.detail.value
	  })
	},
	//双向绑定联系电话
	onStoreTelTap: function (e) {
	  const self = this;
	  const storeTel = self.data.storeTel;
	  self.setData({
	    storeTel: e.detail.value
	  })
	},
	//双向绑定营业执照
	onBusinessLicenseTap: function (e) {
	  const self = this;
	  const businessLicense = self.data.businessLicense;
	  self.setData({
	    businessLicense: e.detail.value
	  })
	},
	//双向绑定公司
	onCompanyTap: function (e) {
	  const self = this;
	  const company = self.data.company;
	  self.setData({
	    company: e.detail.value
	  })
	},
	//选择公司模态框
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
	//选择公司
	onConfirm: function (options) {
		const self = this;
		const company =  options.currentTarget.dataset.company;
		self.setData({
			company:company
		})
		this.hideModal();
	},
	//门店信息填写完成并提交申请
	onSubmitTap:function(){
		console.log("门店信息填写完成并提交申请")
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