// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	wxNo:'',//默认为空，接收我的页面传来的微信号
	weChatValue:'',//本页输入的微信号
	// isShow:false,//显示隐藏绑定成功弹出框
};
const onLoad = function (self) {
	const wxNo = self.data.wxNo;
	const weChatValue = self.weChatValue;
	self.setData({
		wxNo:wxNo,
		weChatValue:wxNo,
	})
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
		const weChatValue = self.data.weChatValue;
		wx.showToast({
		  title:"成功",
		  icon: 'success',//图标，支持"success"、"loading" 
		  duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 
		  mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false 
		  success:function(){
			  User.bindWX(self, {
			      wxNo:weChatValue,
			  }).then((ret) => {
				  console.log("绑定成功");
			  },(err) => {
				console.log("绑定失败");
			  });
		  },
		  fail:function(){},
		  complete:function(){}
		})
		setTimeout(function(){
			wx.hideToast()
		},2000)
		// const isShow = self.data.isShow;
		// self.setData({
		// 	isShow:true
		// });
		// setTimeout(function(){//toast消失
		// 	self.setData({
		// 		isShow:false
		// 	});
		// },1500);
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