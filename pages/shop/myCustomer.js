// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	userInfo:{},//用户信息
	storeId:'1',//接收上一页门店id，测试1
	customerList:[],
};
const onLoad = function(self) {
	self.getMyInfo();
	self.getPageData();
	const storeId = self.data.userInfo.store.id;
	self.setData({
		storeId:storeId
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
	getPageData:function(){
		const self = this;
		const storeId = self.data.storeId;
		User.getClientList(self, {
    		page: self.data.page,
    		pageSize: 10,
			storeId:storeId,
    	}).then((ret) => {
    		if (self.data.page == 1) {
	    		self.setData({
	    			customerList: ret.data.list
	    		});
    		} else {
    			self.setData({
	    			customerList: self.data.customerList.concat(ret.data.list)
	    		});
    		}
    	},(err) => {
            console.log("获取失败");
        });
	},
	//跳转到客户中心
	onCustomerCenterTap:function(options){
		let self = this;
		// 获取索引
		const index = options.currentTarget.dataset.id;
		// 获取当前userId和nickname
		const userId = self.data.customerList[index].id;
		const nickname = self.data.customerList[index].nickname;
	    _g.navigateTo({
			param:{
				nickname:nickname,
				userId:userId,
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