// pages/goods/more.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');

// 初始化数据
const data = {
// value: 0
};

// 页面onLoad方法
const onLoad = function (self) {
   self.getPageData();
};

// 页面onShow方法
const onShow = function (self) {
	
};
const onUnload= function (self) {
    
}
// 页面中的方法
const methods = {
    getPageData: function () {
		var self = this;
		//更多拼团
		Platform.getUserAssembleList(self, {
			page:1,
			pageSize:8,
			assembleId:2333
		}).then((ret)=>{
			let data = ret.data;
			self.setData({
				list: data.list,
			})
	   },(err)=>{
	   
	   });
    },
    onJoinTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/join'
        },self)
    }
};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onShow: onShow,
    methods: methods,
    onUnload: onUnload
});
Page(initPage);