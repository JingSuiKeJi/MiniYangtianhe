// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	toBeUsed:true,
	haveBeenUsed:false,
	outOfDate:false,
	BeUsedNum:'',//待使用的优惠券数
	BeenUsedNum:'',//已使用的优惠券数
	outOfDateNum:'',//已过期的优惠券数
	InvalidList: [], // 过期
	waitUseList: [], // 待使用
	usedList: [], // 已使用
};
const onLoad = function(self) {
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function() {
		let self = this;
		User.getCouponList(self, {
		}).then((ret) => {
		    let data = ret.data;
			self.setData({
				InvalidList:data.InvalidList,
				waitUseList:data.waitUseList,
				usedList:data.usedList,
				BeUsedNum:data.waitUseList.length,
				BeenUsedNum:data.usedList.length,
				outOfDateNum:data.InvalidList.length,
			})
		}, (err) => {
		    console.log("获取失败");
		});
	},
	//待使用
	onToBeUsedTap:function(){
		const self = this;
		self.setData({
			toBeUsed:true,
			haveBeenUsed:false,
			outOfDate:false,
			currentIndex:'0',
		})
	},
	//已使用
	onHaveBeenUsedTap:function(){
		const self = this;
		self.setData({
			toBeUsed:false,
			haveBeenUsed:true,
			outOfDate:false,
			currentIndex:'1',
		})
	},
	//已过期
	onOutOfDateTap:function(){
		const self = this;
		self.setData({
			toBeUsed:false,
			haveBeenUsed:false,
			outOfDate:true,
			currentIndex:'2',
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