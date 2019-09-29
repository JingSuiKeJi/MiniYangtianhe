// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Order = require('../../service/Order');

let data = {
	addressList: [],
	handle: true,//切换管理状态下的背景颜色样式
	currentCheck: 0,
	showModal: false,
	nowAddressId: 0
};
const onLoad = function (self) {
	self.setData({
		from: self.data.from
	});
	self.getPageData();
}
const onShow = function (self) {
	self.getData();
}

const onReady = function (self) { }

const onUnload = function (self) { }

const methods = {
	getData() {
		const self = this;
		self.setData({
			page: 1
		});
		self.getPageData();
	},
	// 接口: 收货地址列表
	getPageData: function () {
		const self = this;
		if (self.data.from == 'order') {
			Order.addressList(self, {
				storeId: self.data.storeId || 0
			}).then((ret) => {
				self.setData({
					addressList: _.map(ret.data, (item) => {
						return {
							id: item.id,
							receiverName: item.name,
							receiverPhone: item.phone,
							isDefault: item.isDefault || 0,
							address: item.address
						}
					})
				})
			});
		} else {
			User.getAddressList(self, {
				page: self.data.page,
				pageSize: 15
			}).then(function (ret) {
				if (self.data.page == 1) {
					self.setData({
						addressList: ret.data
					})
				} else {
					self.setData({
						addressList: self.data.addressList.concat(ret.data)
					})
				}
			});
		}
	},
	//添加收货人
	onAddConsigneeTap: function () {
		let self = this;
		_g.navigateTo({
			param:{
				title:'新增收货人'
			},
			url: 'pages/me/addAddress',
		}, self);
	},
	//管理地址
	onHandleTap: function () {
		const self = this;
		const handle = !self.data.handle;
		self.setData({
			handle: handle
		})
	},
	// 选择默认地址
	chooseMenu: function (options) {
		const self = this;
		const id = options.currentTarget.dataset.id;
		User.chooseDefault(self, {
			addressId: id
		}).then((ret) => {
			self.getData();
			//设置当前样式
			self.setData({
				currentCheck: id,
			})
		});
	},
	//编辑操作
	onCompileTap: function (e) {
		let self = this;
		const index = e.currentTarget.dataset.index;
		// console.log(index,self.data.addressList[index]);
		_g.navigateTo({
			param:{
				title:'编辑',
				addressList:self.data.addressList[index]
			},
			url: 'pages/me/addAddress',
		}, self);
	},
	//删除操作和模态框
	showDialogBtn: function (e) {
		const self = this;
		self.setData({
			showModal: true,
			nowAddressId: e.currentTarget.dataset.id
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
		// this.hideModal();
		const self = this;
		User.deleteAddress(self, {
			addressId: self.data.nowAddressId
		}).then((ret)=>{
			self.setData({
				nowAddressId: 0,
				showModal: false
			});
			self.getData();
		});
	},
	// 完成
	onCompleteTap: function () {
		const self = this;
		const handle = !self.data.handle;
		self.setData({
			handle: handle
		})
	},
	onAddressTap(e) {
		const self = this;
		const opts = e.currentTarget.dataset;
		const item = self.data.addressList[opts.index];
		if (self.data.from != 'order') return;
		_g.getPrevPage().setData({
			orderAddressVo: {
				id: item.id,
				phone: item.receiverPhone,
				address: item.address,
				name: item.receiverName,
				distance: item.distance,
				isDelivery: item.isDelivery,
			}
		});
		_g.navigateBack();
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