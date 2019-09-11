// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	customerList:[
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小哥哥',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'于此长歌',userVipLevel:'my_distributionLevel',lv1:10,lv2:25,orders:1244,amount:2335},
		{userAvatar:'my_infoBoxAvatar',userId:'邻家小姐姐',userVipLevel:'my_distributionLevel2',lv1:10,lv2:25,orders:1244,amount:2335}
	],
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//跳转到客户中心
	onCustomerCenterTap:function(options){
		let self = this;
		// 获取索引
		const id = options.currentTarget.dataset.id;
		// 获取当前userId
		const userId = self.data.customerList[id].userId;
	    _g.navigateTo({
			param:{
				userId:userId
			},
	        url: 'pages/me/customerCenter',
	    }, self);
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