// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	weChatValue:'',//微信号
	isShow:false,//显示隐藏绑定成功弹出框
};
const onLoad = function (self) {

};
const onShow = function (self) { };
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
	//双向绑定输入的value
	onWeChatInputName:function(e){
		const self = this;
		const weChatValue = self.data.weChatValue;
		self.setData({
			weChatValue:e.detail.value
		})
	},
	//绑定微信
	onSaveTap:function(){
		let self = this;
		// _g.toast({
		// 	title: '提交成功',
		// 	icon:'success'
		// });
		const isShow = self.data.isShow;
		self.setData({
			isShow:true
		});
		setTimeout(function(){//toast消失
			self.setData({
				isShow:false
			});
		},1500);
	},
};

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