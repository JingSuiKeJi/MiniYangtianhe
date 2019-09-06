// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	showModal: false,//模态框
};
const onLoad = function (self) { }
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	//显示模态框
	showDialogBtn: function () {
		const self = this;
		self.setData({
		  showModal: true
		})
	},
	//隐藏模态框
	hideModal: function () {
		const self = this;
		self.setData({
		  showModal: false
		});
	},
	//分享给朋友
	onFriendsShare: function () {
		const self = this;
		self.hideModal();
	},
	//保存图片
	onSaveImage: function () {
		const self = this;
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