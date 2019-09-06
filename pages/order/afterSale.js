// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	menuList:[
		{name:"已过期",currentId:1},
		{name:"售后订单",currentId:2},
		{name:"处理中",currentId:3},
		{name:"已完成",currentId:4}
	],
	currentCheck: 1,
	showModal: false,
	orderList:[
		{orderReference:54636465456165465,store:"拼团",orderStatus:"已过期",flagId:1,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'已过期'},
				{newsImg:"my_weImg",newsName:"红豆龟苓膏",newsWeight:"250gx两盒装",newsMoney:10.00,goodsStatus:'已过期'},
			]
		},
		{orderReference:54636465456165465,store:"拼团",orderStatus:"已过期",flagId:1,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'已过期'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"退款成功",flagId:2,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'退货退款'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"退款失败",flagId:2,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'仅退款'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"审核中",flagId:2,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'换货'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"审核中",flagId:3,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'退货退款'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"审核中",flagId:3,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'仅退款'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"退款成功",flagId:4,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'退货退款'},
			]
		},
		{orderReference:54636465456165465,orderStatus:"退款失败",flagId:4,
			storeList:[
				{newsImg:"my_vce",newsName:"养生堂维C+维E",newsWeight:"250gx两盒装",newsMoney:99.00,goodsStatus:'仅退款'},
			]
		}
	],
};
const onLoad = function(self) {
	
};
const onShow = function(self) {
	
};
const onReady = function(self) {};
const onUnload = function(self) {};
const methods = {
	//选择菜单状态
	chooseMenu:function(options){
		let self = this;
		//当前选择
		const id = options.currentTarget.dataset.id;
		//列表
		const orderList = self.data.orderList;
		//设置当前样式
		self.setData({
			currentCheck:id,
		})
	},
	//跳转到对应的状态页
	onOrderDetailTap:function(options){
		let self = this;
		//订单状态
		const orderStatus = options.currentTarget.dataset.orderStatus;
		const flagId = options.currentTarget.dataset.flagId;
		const goodsStatus = options.currentTarget.dataset.goodsStatus;
			_g.navigateTo({
				param:{
			    	orderStatus:orderStatus,
					flagId:flagId,
					goodsStatus:goodsStatus,
			    },
				url: 'pages/order/afterDetails',
			}, self);
	},
	//跳转到申请售后
	onAfterApplicationTap:function(){
		let self = this;
		_g.navigateTo({
			url: 'pages/order/applyAfter',
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