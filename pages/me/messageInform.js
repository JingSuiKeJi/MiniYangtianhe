// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	userInfo: {}, //用户信息
	isRemindShare: 0, // 分享成功提醒：1.是 0.否
	isRemindCoupon: 0, // 优惠券获得提醒：1.是 0.否
	isRemindCut: 0, // 砍价提醒：1.是 0.否
};
const onLoad = function(self) {
	self.getMyInfo();
	const userInfo= self.data.userInfo;
	self.setData({
		isRemindShare:userInfo.isRemindShare,
		isRemindCoupon:userInfo.isRemindCoupon,
		isRemindCut:userInfo.isRemindCut,
	})
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getMyInfo() {
	    const self = this;
		const userInfo = self.data.userInfo;
	    self.setData({
	        userInfo: _g.getLS(_c.LSKeys.userInfo),
	    });
	},
	//开启/关闭提醒方法
	remindState: function(thisType,thisStatus) {
		User.msgToggle(self, {
			type:thisType,
			status:thisStatus,
		}).then((ret) => {
			console.log("提醒接口调用成功");
		}, (err) => {
			console.log("提醒接口调用失败");
		});
	},
	//分享成功提醒
	onRemindTap:function(e){
		const self = this;
		const thisType = e.target.dataset.type;
		const isRemindShare = self.data.isRemindShare;
		const isRemindCoupon = self.data.isRemindCoupon;
		const isRemindCut = self.data.isRemindCut;
		if(thisType==1){
			if(isRemindShare==0){
				self.setData({
					isRemindShare:1
				});
				self.remindState(thisType,1)
			}else if(isRemindShare==1){
				self.setData({
					isRemindShare:0
				});
				self.remindState(thisType,0)
			}
		}
		if(thisType==2){
			if(isRemindCoupon==0){
				self.setData({
					isRemindCoupon:1
				});
				self.remindState(thisType,1)
			}else if(isRemindCoupon==1){
				self.setData({
					isRemindCoupon:0
				});
				self.remindState(thisType,0)
			}
		}
		if(thisType==3){
			if(isRemindCut==0){
				self.setData({
					isRemindCut:1
				});
				self.remindState(thisType,1)
			}else if(isRemindCut==1){
				self.setData({
					isRemindCut:0
				});
				self.remindState(thisType,0)
			}
		}
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