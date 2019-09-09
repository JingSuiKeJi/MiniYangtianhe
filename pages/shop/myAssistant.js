// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	assistantList:[
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,delete:'删除'},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,delete:'删除'}
	],
	addList:[
		{addAvatar:'my_infoBoxAvatar',addId:'邻家小姐姐',current:false,currentId:0},
		{addAvatar:'my_infoBoxAvatar',addId:'邻家小姐姐',current:false,currentId:1},
		{addAvatar:'my_infoBoxAvatar',addId:'邻家小姐姐',current:false,currentId:2},
	],
	currentCheck: 0,
	showModal:false,//添加店员模态框显隐
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//添加店员模态框
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
	onConfirm: function () {
		this.hideModal();
	},
	//check状态切换
	onCheckStatusTap:function(options){
		let self = this;
		//当前索引
		let index = options.currentTarget.dataset.id;
		//修改的check
		let current = !self.data.addList[index].current;
		//点击的check
		let currentM = "addList["+index+"].current";
		self.setData({
			[currentM]:current
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