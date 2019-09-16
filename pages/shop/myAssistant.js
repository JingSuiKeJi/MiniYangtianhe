// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	hasNextPage:true,
	page:1,
	storeId:1,//接收上一页选择的顾客id，1为测试数据
	assistantList:[
		// {userAvatar:'my_infoBoxAvatar',nickname:'于此长歌',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:1},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小姐姐',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:2},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小哥哥',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:3},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小哥哥',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:4},
		// {userAvatar:'my_infoBoxAvatar',nickname:'于此长歌',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:5},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小姐姐',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:6},
		// {userAvatar:'my_infoBoxAvatar',nickname:'于此长歌',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:7},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小姐姐',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:8},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小哥哥',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:9},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小哥哥',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:10},
		// {userAvatar:'my_infoBoxAvatar',nickname:'于此长歌',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:11},
		// {userAvatar:'my_infoBoxAvatar',nickname:'邻家小姐姐',oneLevelTeamNum:10,twoLevelTeamNum:25,totalMoney:1244,id:12}
	],
	nameId:'',//店员id/昵称
	checkStoreId:'',
	checkUserId:'',
	addList:[
		// {addAvatar:'my_infoBoxAvatar',nickname:'邻家钢铁侠',type:1},
		// {addAvatar:'my_infoBoxAvatar',nickname:'邻家蜘蛛侠',type:2},
		// {addAvatar:'my_infoBoxAvatar',nickname:'邻家蝙蝠侠',type:3},
	],
	showModal:false,//添加店员模态框显隐
};
const onLoad = function(self) {
	//接收上一个页面状态
	const storeId = self.data.storeId;
	self.setData({
		storeId:storeId,
	});
	self.getDataPage();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getDataPage:function(){
		const self = this;
		const storeId = self.data.storeId;
		//门店店员列表
		User.getVerifierList(self, {
    		page: self.data.page,
    		pageSize: 10,
			storeId:storeId,
    	}).then((ret) => {
    		if (self.data.page == 1) {
	    		self.setData({
	    			assistantList: ret.data.list
	    		});
    		} else {
    			self.setData({
	    			assistantList: self.data.assistantList.concat(ret.data.list)
	    		});
    		}
    	},(err) => {
            console.log("获取失败");
       });
	},
	//删除店员
	onDeleteTap:function(e){
		const self = this;
		const verifierId = e.target.dataset.id;
		const idx = e.target.dataset.idx;
		const assistantList = self.data.assistantList;
		//删除店员
		User.deleteVerifier(self, {
            verifierId: verifierId,
        }).then((ret) => {
           assistantList.splice(idx,1);
           self.setData({
			assistantList:assistantList
           })
        }, (err) => {
            console.log("删除失败");
        });
	},
	//查找店员
	onSearchTap:function(){
		const self = this;
		const nameId = self.data.nameId;
		//查找店员
		User.searchVerifier(self, {
			page: self.data.page,
			pageSize: 10,
			keyword:nameId,
		}).then((ret) => {
			_.each(ret.data.list, function(item) {
				item.check= false; 
			})
			const hasNextPage = self.data.hasNextPage;
			self.setData({
				hasNextPage:ret.data.hasNextPage
			});
			// console.log(JSON.stringify(ret.data.list))
			if (self.data.page == 1) {
				self.setData({
					addList: ret.data.list
				});
			} else {
				self.setData({
					addList: self.data.addList.concat(ret.data.list)
				});
			}
			// const addList = self.data.addList;
			// console.log(123,addList);
		},(err) => {
			console.log("获取失败");
		});
	},
	//搜索框双向绑定
	onSearchVerifierTap:function(e){
		const self = this;
		self.setData({
			nameId: e.detail.value
		})
		self.onSearchTap()
	},
	//滚动框触底
	onBindBottomTap:function(){
		const self = this;
		const hasNextPage = self.data.hasNextPage;
		if(hasNextPage==true){
			const page = self.data.page;
			self.setData({
				page:page+1
			})
			self.onSearchTap()
		}
	},
	//添加店员模态框
	showDialogBtn: function () {
		const self = this;
		self.setData({
		  showModal: true
		})
	},
	hideModal: function () {
		const self = this;
		self.setData({
		  showModal: false,
		  nameId:'',
		  addList:[],
		  checkStoreId:[],
		  checkUserId:[],
		});
	},
	onCancel: function () {
		const self = this;
		self.hideModal();
	},
	//确认添加店员
	onConfirm: function () {
		const self = this;
		const checkStoreId = parseInt(self.data.checkStoreId);
		const checkUserId = parseInt(self.data.checkUserId);
		// console.log(23,checkStoreId,checkUserId);
		//添加店员
		User.addVerifier(self, {
			storeId:checkStoreId,
			userId:checkUserId,
		}).then((ret) => {
			console.log("添加成功");
		}, (err) => {
			console.log("添加失败");
		});
		// self.hideModal();
	},
	//check状态切换
	onCheckStatusTap:function(options){
		const self = this;
		//当前索引
		const idx = options.currentTarget.dataset.idx;
		//获取列表
		const addList = self.data.addList;
		//排他
		for (var i = 0; i < addList.length; i++) {
			addList[i].check = false;
			addList[idx].check = true;
		}
		// addList[idx].check = !addList[idx].check; //当前点击的位置为true即选中
		self.setData({
			addList:addList,
			checkStoreId:addList[idx].storeId,
			checkUserId:addList[idx].userid,
		})
		// const checkStoreId = self.data.checkStoreId;
		// const checkUserId = self.data.checkUserId;
		// if(addList[idx].check==true){
		// 	checkStoreId.push(addList[idx].storeId);
		// 	checkUserId.push(addList[idx].userid);
		// } else {
		// 	const index = _.findIndex(self.data.checkStoreId, function(item) {
		// 		return item == addList[idx].storeId;
		// 	})
		// 	if(index < 0) {
		// 		return;
		// 	}
		// 	checkStoreId.splice(index, 1);
		// 	checkUserId.splice(index, 1);
		// }
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