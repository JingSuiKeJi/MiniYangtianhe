// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Region = require('../../res/Area');

let data = {
	set: false,
	name: '',
	tel: '',
	addressDetail: '',
	// region: ['广东省', '广州市', '天河区'],
	region: '',
	customItem: '全部',
	// 爱亲 获取 省市区: 
	changeDeep: 0,
	initRegion: Region,
	firstChange: false,
	provinceIndex: 0,
	cityIndex: 0,
	areaIndex: 0,
	confirmSelect: [0, 0, 0],
	// 接口所需参数:
	provinceId: '',
	provinceName: '',
	cityId: '',
	cityName: '',
	areaId: '',
	areaName: '',
};
const onLoad = function (self) {
	self.getProvince();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	// 设置默认地址开关
	onSetTap: function () {
		const self = this;
		const set = !self.data.set;
		self.setData({
			set: set
		})
	},
	//双向绑定姓名
	onNameTap: function (e) {
		const self = this;
		const name = self.data.name;
		self.setData({
			name: e.detail.value
		})
	},
	//双向绑定手机
	onTelTap: function (e) {
		const self = this;
		const tel = self.data.tel;
		self.setData({
			tel: e.detail.value
		})
	},
	//双向绑定区域
	onAreaTap: function (e) {
		const self = this;
		const area = self.data.area;
		self.setData({
			area: e.detail.value
		})
	},
	//选择区域
	onAreaSeletTap: function () {
		const self = this;
		console.log(1);
	},
	//双向绑定地址
	onAddressDetailTap: function (e) {
		const self = this;
		const addressDetail = self.data.addressDetail;
		self.setData({
			addressDetail: e.detail.value
		})
	},
	//三级选择器省市区
	bindRegionChange: function (e) {
		// console.log('picker发送选择改变，携带值为', e.detail.value)
		console.log(e.detail);
		// console.log(e.detail.code);
		this.setData({
			region: e.detail.value,
			regionCode: e.detail.code
		})
	},
	//保存
	onSaveTap: function () {
		const self = this;
		const phoneReg = /^1[0-9]{10}$/;

		// 省市区
		self.setData({
			provinceId: Region[self.data.confirmSelect[0]].id,
			provinceName: Region[self.data.confirmSelect[0]].name,
			cityId: Region[self.data.confirmSelect[0]].sub[self.data.confirmSelect[1]].id,
			cityName: Region[self.data.confirmSelect[0]].sub[self.data.confirmSelect[1]].name,
			areaId: Region[self.data.confirmSelect[0]].sub[self.data.confirmSelect[1]].sub[self.data.confirmSelect[2]].id,
			areaName: Region[self.data.confirmSelect[0]].sub[self.data.confirmSelect[1]].sub[self.data.confirmSelect[2]].name,

		})

		if (!self.data.name.trim()) {
			_g.toast({
				title: '请输入姓名'
			});
			return
		}
		if (!self.data.tel.trim()) {
			_g.toast({
				title: '请输入手机号'
			});
			return
		}
		if (!phoneReg.test(self.data.tel)) {
			_g.toast({
				title: '请输入正确的手机号码'
			});
			return
		}

		if (!self.data.addressDetail.trim()) {
			_g.toast({
				title: '请输入详细地址'
			});
			return
		}

		// 接口: 新增收货地址
		Me.getAddressAdd(self, {
			receiverName: self.data.name,
			receiverPhone: self.data.tel,
			lon: 1,
			lat: 1,
			provinceId: self.data.provinceId,
			provinceName: self.data.provinceName,
			cityId: self.data.cityId,
			cityName: self.data.cityName,
			areaId: self.data.areaId,
			areaName: self.data.areaName,
			is_default: self.data.set == false ? 0 : 1,
			address: self.data.addressDetail,
		}).then(function (ret) {

		});

	},
	// 微信 获取 经纬度:
	onMapTap() {
		wx.chooseLocation({
			success(ret) {
				console.log(ret)
			},
			fail() {

			}
		})
	},


	//  爱亲 获取 省市区: 
	getProvince() {
		const self = this;
		let province = [];
		_.each(Region, (item, index) => {
			province.push(item.name);
			if (self.data.firstChange && self.data.provinceId && self.data.provinceId == item.id) {
				self.setData({
					provinceIndex: index,
					'confirmSelect[0]': index
				});
			}
		});
		self.setData({
			province: province
		});
		self.getCity();
	},
	getCity() {
		const self = this;
		let city = [];
		_.each(Region[self.data.provinceIndex].sub, (item, index) => {
			city.push(item.name);
			if (self.data.firstChange && self.data.cityId && self.data.cityId == item.id) {
				self.setData({
					cityIndex: index,
					'confirmSelect[1]': index
				});
			}
		});
		self.setData({
			city: city
		});
		self.getArea();
	},
	getArea() {
		const self = this;
		let area = [];
		_.each(Region[self.data.provinceIndex].sub[self.data.cityIndex].sub, (item, index) => {
			area.push(item.name);
			if (self.data.firstChange && self.data.areaId && self.data.areaId == item.id) {
				self.setData({
					areaIndex: index,
					'confirmSelect[2]': index,
					firstChange: false
				});
			}
		});
		self.setData({
			area: area
		});
		self.setReginData();
	},
	setReginData() {
		const self = this;
		if (self.data.changeDeep == 0) {
			self.setData({
				showRegion: [self.data.province, self.data.city, self.data.area]
			});
		} else if (self.data.changeDeep == 1) {
			self.setData({
				'showRegion[1]': self.data.city,
				'showRegion[2]': self.data.area
			});
		} else if (self.data.changeDeep == 2) {
			self.setData({
				'showRegion[2]': self.data.area
			});
		}
	},
	columnChange(e) {
		const self = this;
		console.log(e.detail);
		switch (e.detail.column) { // 此时的改变列数
			case 0:
				self.setData({
					provinceIndex: e.detail.value
				});
				self.getProvince();
				break;
			case 1:
				self.setData({
					cityIndex: e.detail.value
				});
				self.getCity();
				break;
			case 2:
				self.setData({
					areaIndex: e.detail.value
				});
				self.getArea();
				break;
		}
	},
	onConfirmPickerTap(e) {
		const self = this;
		if (!self.data.provinceIndex) return;
		self.setData({
			confirmRegion: true,
			confirmSelect: [self.data.provinceIndex, self.data.cityIndex, self.data.areaIndex]
		});
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