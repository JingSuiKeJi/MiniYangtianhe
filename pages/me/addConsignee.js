// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	set:false,
	name:'',
	tel:'',
	addressDetail:'',
	// region: ['广东省', '广州市', '天河区'],
	region:'',
	customItem: '全部',
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	// 设置默认地址开关
	onSetTap:function(){
		const self = this;
		const set = !self.data.set;
		self.setData({
			set:set
		})
	},
	//双向绑定姓名
	onNameTap: function (e) {
	  const self = this;
	  const name = self.data.name;
	  self.setData({
	    name: e.detail.value
	  })
	},
	//双向绑定手机
	onTelTap: function (e) {
	  const self = this;
	  const tel = self.data.tel;
	  self.setData({
	    tel: e.detail.value
	  })
	},
	//双向绑定区域
	onAreaTap: function (e) {
	  const self = this;
	  const area = self.data.area;
	  self.setData({
	    area: e.detail.value
	  })
	},
	//选择区域
	onAreaSeletTap:function () {
		const self = this;
		console.log(1);
	},
	//双向绑定地址
	onAddressDetailTap: function (e) {
	  const self = this;
	  const addressDetail = self.data.addressDetail;
	  self.setData({
	    addressDetail: e.detail.value
	  })
	},
	//三级选择器省市区
	bindRegionChange: function (e) {
	  // console.log('picker发送选择改变，携带值为', e.detail.value)
	  this.setData({
	    region: e.detail.value
	  })
	},
	//保存
	onSaveTap:function(){
		
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