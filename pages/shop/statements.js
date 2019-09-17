// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	weekList:['日','一','二','三','四','五','六'],
	dateList:['14','15','16','17','18','19','20'],
	currentDataState:'17',//当前选择日期
	todayFlag:true,
	weekFlag:false,
	monthFlag:false,
	detailReportList:[
		{year:'2019/07/31',time:'12:45:13',
			detailList:[
				{incident:'应收订单金额',price:'¥19.00'},
				{incident:'实收订单金额',price:'¥19.00'},
				{incident:'福气抵扣金额',price:'¥1.38'},
				{incident:'抵扣福气数',price:'138'},
			],
		},
		{year:'2019/07/31',time:'12:45:13',
			detailList:[
				{incident:'福气核销金额',price:'¥19.00'},
				{incident:'核销福气数',price:'190000'},
			],
		},
		{year:'2019/07/31',time:'12:45:13',
			detailList:[
				{incident:'应收订单金额',price:'¥19.00'},
				{incident:'实收订单金额',price:'¥19.00'},
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
		const currentDataState = dateList[id];
		//设置当前样式
		self.setData({
			currentDataState:currentDataState
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