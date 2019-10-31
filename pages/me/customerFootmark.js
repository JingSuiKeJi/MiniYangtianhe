// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {
	calendarFlag: false,//true完整日历/false单行日历
	statusList: [
		{ status: '当天', type: 1 },
		{ status: '一周', type: 2 },
		{ status: '一个月', type: 3 },
	],
	//完整日历
	dayStyle: [
		{ month: 'current', day: new Date().getDate(), color: '#333333', background: 'rgba(255,255,255,0)' },
		{ month: 'current', day: new Date().getDate(), color: '#FFFFFF', background: '#1DC4BC' }
	],
	//单行日历
	weekList: ['日', '一', '二', '三', '四', '五', '六'],
	dateList: [],//每周日份
	currentData: '',//当前选择日期/默认今日日份
	currentTimestamp: '',//当前选中时间戳/默认今日日份时间戳
	dateList: [
		{ date: '8月7号' },
		{ date: '8月6号' }
	],
	imgAndPriceList: [
		{ img: 'my_herbalJelly', price: 5.8 },
		{ img: 'my_herbalJelly', price: 5.8 },
		{ img: 'my_herbalJelly', price: 5.8 },
		{ img: 'my_herbalJelly', price: 5.8 },
		{ img: 'my_herbalJelly', price: 5.8 },
		{ img: 'my_herbalJelly', price: 5.8 },
	],
	showAndHideCheck: false,//check框显隐
	slectAllIcon: false,//
	list: [],
	reqTimestamp: 0
};
const onLoad = function (self) {
	self.setData({
		reqTimestamp: Math.round(Date.parse(new Date(new Date().Format('yyyy/MM/dd'))) / 1000),
	})
	self.getSunday();
	self.getData();

}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
	getData: function () {
		let self = this;
		self.getPageData();
	},
	getPageData: function () {
		let self = this;
		User.browseList(self, {
			page: self.data.page,
			pageSize: 20,
			userId: self.data.userId,
			date: self.data.reqTimestamp
		}).then((ret) => {
			self.setData({
				list: self.data.list.concat(ret.data.list),
				time: new Date(self.data.reqTimestamp * 1000).Format('MM/dd')
			})
		}, (err) => {
		});
	},
	deleteBrowse: function (value) {
		let self = this;
		User.deleteBrowse(self, {
			ids: value
		}).then((ret) => {
			self.setData({
				slectAllIcon: false,
				list: [],
				page: 1
			})
			self.getPageData();
		}, (err) => {

		});
	},
	//选择日历日期
	onChooseDate: function (options) {
		let self = this;
		console.log(5555, options)
		//当前索引
		const id = options.currentTarget.dataset.id;
		//获取日份列表
		const dateList = self.data.dateList;
		//当前选中日份
		const currentData = dateList[id].day;
		//获取当前日份时间戳
		const currentTimestamp = new Date(dateList[id].date).getTime() / 1000;
		//更改完整日历选中状态
		const changeBgColor = `dayStyle[0].color`;
		const changeBg = `dayStyle[0].background`;
		const changeDay = `dayStyle[1].day`;
		const changeEndBg = `dayStyle[1].background`;
		self.setData({
			[changeDay]: currentData,
			[changeBg]: "rgba(255,255,255,0)",
			[changeBgColor]: "black",
			[changeEndBg]: "#1DC4BC",
			reqTimestamp: currentTimestamp,
			currentTimestamp: currentTimestamp,//选中时间戳
			currentData: currentData,//选中日份
			list: [],
			page: 1
		})
		self.getPageData()
	},
	//获取每周第一天:周日,并返回这一周的日份列表
	getSunday: function () {
		const self = this;
		//获取今日时间
		const d = new Date();
		//今日日份
		const nowDay = d.getDate();
		//获取当前日份时间戳
		const currentTimestamp = new Date(d.setDate(nowDay)).getTime();
		//今日下标 对应的是0-6，周日~周六。
		const day = d.getDay();
		//一整天的毫秒数
		const oneDay = 24 * 60 * 60 * 1000;
		//每周日的时间戳
		const sunTime = currentTimestamp - day * oneDay;
		const timestampList = [];
		for (var i = 0; timestampList.length < 7; i++) {
			let param = {
				date: new Date(sunTime + i * oneDay).Format('yyyy/MM/dd'),
				day: new Date(sunTime + i * oneDay).getDate()
			}
			// timestampList.push(new Date(sunTime+i*oneDay).getDate())
			timestampList.push(param)
		}
		self.setData({
			currentTimestamp: currentTimestamp,//今日时间戳
			currentData: nowDay,//今日日份
			dateList: timestampList,//本周日份
		})
	},
	onPullUpTap: function () {
		const self = this;
		self.setData({
			calendarFlag: false
		})
	},
	onPullDownTap: function () {
		const self = this;
		self.setData({
			calendarFlag: true
		})
	},
	//完整日历，给点击的日期设置一个背景颜色
	dayClick: function (e) {
		const self = this;
		const dayClick = e.detail.day;//当前选择日份
		const changeBgColor = `dayStyle[0].color`;
		const changeBg = `dayStyle[0].background`;
		const changeDay = `dayStyle[1].day`;
		const changeEndBg = `dayStyle[1].background`;
		//获取当前选择的时间戳
		const currentTime = e.detail.year + "-" + e.detail.month + "-" + e.detail.day;
		console.log(e)
		const currentTimestamp = new Date(e.detail.year, e.detail.month-1, e.detail.day).getTime() / 1000;
		console.log(33,currentTimestamp)
		self.setData({
			[changeDay]: dayClick,
			[changeBg]: "rgba(255,255,255,0)",
			[changeBgColor]: "black",
			[changeEndBg]: "#1DC4BC",
			reqTimestamp: currentTimestamp,//当前选中时间戳
			currentTimestamp: currentTimestamp,//当前选中时间戳
			currentData: dayClick,//当前选中时间
			list: [],
			page: 1
		});
		self.getPageData()
	},
	//显示隐藏check
	onCancelSwitchTap: function () {
		let self = this;
		self.setData({
			showAndHideCheck: !self.data.showAndHideCheck
		})
	},
	//全选check
	onSelectAllIcontap: function () {
		const self = this;
		const slectAllIcon = !self.data.slectAllIcon;
		const list = self.data.list;
		_.map(list, (item) => {
			item.slectAllIcon = slectAllIcon;
		})
		self.setData({
			slectAllIcon: slectAllIcon,
			list: list
		})
	},
	//删除选中
	onDeleteTap: function () {
		let self = this;
		let ids = '';
		_.map(self.data.list, (item, index) => {
			if (item.slectAllIcon) {
				if (index == 0) {
					ids = item.id
				} else {
					ids = ids + ',' + item.id
				}

			}
		})
		if (!ids) {
			_g.toast({
				title: '请选择要删除的足迹'
			});
			return
		}
		self.deleteBrowse(ids);
		self.setData({
			showAndHideCheck: false
		})
	},
	onSeleteTap: function (e) {
		let self = this;
		let index = e.currentTarget.dataset.index;
		let list = self.data.list;
		list[index].slectAllIcon = !list[index].slectAllIcon;
		let param = {
			list: list
		}
		for (let index = 0; index < list.length; index++) {
			if (!list[index].slectAllIcon) {
				param.slectAllIcon = false
				self.setData(param);
				return false;
			}

		}
		// list.forEach(item => {
		// 	if(!item.slectAllIcon){
		// 		param.slectAllIcon = false
		// 		self.setData(param);
		//         return false;
		// 	}
		// });
		param.slectAllIcon = true;
		self.setData(param)

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