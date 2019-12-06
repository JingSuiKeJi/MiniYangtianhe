// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	hasNextPage: true,
	page: 1,
	storeId: 1,//接收上一页门店id，1为测试数据
	assistantList: [],
	nameId: '',//店员id/昵称
	// checkStoreId:'',
	checkUserId: -1,
	addList: [],
	showModal: false,//添加店员模态框显隐
};
const onLoad = function (self) {
    self.setData({
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    })
	self.getPageData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getPageData: function () {
		const self = this;
		const storeId = self.data.storeId;
		//门店店员列表
		User.getVerifierList(self, {
			page: self.data.page,
			pageSize: 20,
			storeId: storeId,
		}).then((ret) => {
			if (self.data.page == 1) {
				self.setData({
					assistantList: ret.data.list,
				});
			} else {
				self.setData({
					assistantList: self.data.assistantList.concat(ret.data.list)
				});
			}
		}, (err) => {
		});
	},
	//删除店员
	onDeleteTap: function (e) {
		const self = this;
		const verifierId = e.target.dataset.id;
		const idx = e.target.dataset.idx;
		const assistantList = self.data.assistantList;
		//删除店员
		User.deleteVerifier(self, {
			verifierId: verifierId,
		}).then((ret) => {
			assistantList.splice(idx, 1);
			self.setData({
				assistantList: assistantList
			})
		}, (err) => {
		});
	},
	//查找店员
	onSearchTap: function () {
		const self = this;
		const nameId = self.data.nameId;
		//查找店员
		User.searchVerifier(self, {
			page: self.data.page,
			pageSize: 20,
			keyword: nameId,
		}).then((ret) => {
			if (!ret.data.list) {
				self.setData({
					addList: [],
					hasNextPage: false
				});
				return;
			}
			if (self.data.page == 1) {
				self.setData({
					addList: ret.data.list,
					hasNextPage: ret.data.hasNextPage
				});
			} else {
				self.setData({
					addList: self.data.addList.concat(ret.data.list),
					hasNextPage: ret.data.hasNextPage
				});
			}
		}, (err) => {
		});
	},
	//搜索框双向绑定
	onSearchVerifierTap: function (e) {
		const self = this;
		self.setData({
			nameId: e.detail.value,
			page: 1
		})
		self.onSearchTap()
	},
	//滚动框触底
	onBindBottomTap: function () {
		const self = this;
		const hasNextPage = self.data.hasNextPage;
		if (hasNextPage == true) {
			const page = self.data.page;
			self.setData({
				page: page + 1
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
			nameId: '',
			//   addList:[],
			checkUserId: -1,
		});
	},
	onCancel: function () {
		const self = this;
		self.hideModal();
	},
	//确认添加店员
	onConfirm: function () {
		const self = this;
		const checkUserId = parseInt(self.data.checkUserId);
        const storeId = self.data.storeId;
        const assistantList = self.data.assistantList;
		if (checkUserId == -1) {
			_g.toast({ title: '请选择要添加的店员' });
			return;
		}
		User.addVerifier(self, {
			storeId: storeId,
			userId: checkUserId,
		}).then((ret) => {
            // 20 是getPageData()一次请求多少条数据
            if (self.data.page == 1 && assistantList.length < 20) {
                //self.getPageData();
                assistantList.push(ret.data);
                self.setData({
                    assistantList: assistantList
                })
            }else {
                _g.toast({
                    title: '添加店员成功',
                    duration: 2000
                })
            }
			
		}, (err) => {
		});
		self.hideModal();
	},
	//check状态切换
	onCheckStatusTap: function (options) {
		const self = this;
		const id = options.currentTarget.dataset.id;
		if (self.data.checkUserId == id) {
			self.setData({
				checkUserId: -1,
			});
			return;
		}
		self.setData({
			checkUserId: id,
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