// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
	weekList:['日','一','二','三','四','五','六'],
	dateList:['14','15','16','17','18','19','20'],
	currentDateState:'17',//当前选择日期
	todayFlag:true,//当天
	weekFlag:false,//一周
	monthFlag:false,//一个月
	detailBlissList:[
		{date:'7月17日',todayFlag:true,weekFlag:true,monthFlag:true,
			detailList:[
				{detailDate:'2019.07.01',name:'小小猴子',verifyNum:188},
				{detailDate:'2019.07.01',name:'阿丽塔',verifyNum:688},
				{detailDate:'2019.07.01',name:'小小小辛巴',verifyNum:2333},
			],
		},
		{date:'7月15日',weekFlag:true,monthFlag:true,
			detailList:[
				{detailDate:'2019.07.15',name:'超…美少女',verifyNum:23188},
				{detailDate:'2019.07.15',name:'小小小辛巴',verifyNum:2333},
			],
		},
		{date:'7月2日',monthFlag:true,
			detailList:[
				{detailDate:'2019.07.02',name:'超…美少女',verifyNum:23188},
			],
		},
	]
};
const onLoad = function(self) {}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	//选择日历日期
	onChooseDate:function(options){
		let self = this;
		//当前选择
		const id = options.currentTarget.dataset.id;
		//列表
		const dateList = self.data.dateList;
		//当前列表名
		const currentDateState = dateList[id];
		//设置当前样式
		self.setData({
			currentDateState:currentDateState
		})
	},
	//今日报表
	onChooseToday:function(options){
		let self = this;
		self.setData({
			todayFlag:true,
			weekFlag:false,
			monthFlag:false,
		})
	},
	//一周报表
	onChooseWeek:function(options){
		let self = this;
		self.setData({
			todayFlag:false,
			weekFlag:true,
			monthFlag:false,
		})
	},
	//一个月报表
	onChooseMonth:function(options){
		let self = this;
		self.setData({
			todayFlag:false,
			weekFlag:false,
			monthFlag:true,
		})
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