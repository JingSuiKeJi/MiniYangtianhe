// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');

let data = {
	calendarFlag:false,//true完整日历/false单行日历
	storeId:19,//接收上一页门店id，19为测试数据
	statusList:[
		{status:'当天',type:1},
		{status:'一周',type:2},
		{status:'一个月',type:3},
	],
	//完整日历
	dayStyle: [
	  {month: 'current', day: new Date().getDate(), color: '#333333', background: 'rgba(255,255,255,0)'},
	  {month: 'current', day: new Date().getDate(), color: '#FFFFFF', background: '#1DC4BC'}
	],
	//单行日历
	weekList:['日','一','二','三','四','五','六'],
	dateList:[],//每周日份
	currentData:'',//当前选择日期/默认今日日份
	currentTimestamp:'',//当前选中时间戳/默认今日日份时间戳
	currentType:1,//报表时间段，默认1 1当天/2一周/3一个月
	reportList:[
		// {year:'2019/07/31',time:'12:45:13',
		// 	detailList:[
		// 		{incident:'应收订单金额',price:'¥19.00'},
		// 		{incident:'实收订单金额',price:'¥19.00'},
		// 		{incident:'福气抵扣金额',price:'¥1.38'},
		// 		{incident:'抵扣福气数',price:'138'},
		// 	],
		// },
		// {year:'2019/07/31',time:'12:45:13',
		// 	detailList:[
		// 		{incident:'福气核销金额',price:'¥19.00'},
		// 		{incident:'核销福气数',price:'190000'},
		// 	],
		// },
		// {year:'2019/07/31',time:'12:45:13',
		// 	detailList:[
		// 		{incident:'应收订单金额',price:'¥19.00'},
		// 		{incident:'实收订单金额',price:'¥19.00'},
		// 	],
		// },
	]
};
const onLoad = function(self) {
	self.getSunday();
	//接收上一个页面状态
	const storeId = self.data.storeId;
	self.setData({
		storeId:storeId,
	});
	self.getData();
}
const onShow = function(self) {}

const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData:function(){
		const self = this;
		const reportList = self.data.reportList;
		const currentType = self.data.currentType;
		const storeId = self.data.storeId;
		const currentTimestamp = self.data.currentTimestamp/1000;
		User.getFinanceInfo(self, {
            storeId:storeId,
			type:currentType,
			dayTime:currentTimestamp
        }).then((ret) => {
			const list = ret.data;
			self.setData({
				reportList:list
			})
        }, (err) => {
            console.log("获取失败");
        });
	},
	//选择日历日期
	onChooseDate:function(options){
		let self = this;
		//当前索引
		const id = options.currentTarget.dataset.id;
		//获取日份列表
		const dateList = self.data.dateList;
		//当前选中日份
		const currentData = dateList[id];
		//获取当前日份时间戳
		const currentTimestamp = new Date(new Date().setDate(currentData)).getTime();
		//更改完整日历选中状态
		const changeBgColor = `dayStyle[0].color`;
		const changeBg = `dayStyle[0].background`;
		const changeDay = `dayStyle[1].day`;
		const changeEndBg = `dayStyle[1].background`;
		self.setData({
			[changeDay]: currentData,
			[changeBg]:"rgba(255,255,255,0)",
			[changeBgColor]:"black",
			[changeEndBg]: "#1DC4BC",
			currentTimestamp:currentTimestamp,//选中时间戳
			currentData:currentData,//选中日份
		})
		self.getData();
	},
	//获取每周第一天:周日,并返回这一周的日份列表
	getSunday:function () {
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
		const oneDay = 24*60*60*1000;
		//每周日的时间戳
		const sunTime = currentTimestamp-day*oneDay;
		const timestampList = [];
		for (var i = 0; timestampList.length < 7; i++) {
			timestampList.push(new Date(sunTime+i*oneDay).getDate())
		}
		self.setData({
			currentTimestamp:currentTimestamp,//今日时间戳
			currentData:nowDay,//今日日份
			dateList:timestampList,//本周日份
		})
	},
	onPullUpTap:function(){
		const self = this;
		self.setData({
			calendarFlag:false
		})
	},
	onPullDownTap:function(){
		const self = this;
		self.setData({
			calendarFlag:true
		})
	},
	//完整日历，给点击的日期设置一个背景颜色
	dayClick: function (e) {
		const self = this;
		console.log(e);
		const dayClick = e.detail.day;//当前选择日份
		const changeBgColor = `dayStyle[0].color`;
		const changeBg = `dayStyle[0].background`;
		const changeDay = `dayStyle[1].day`;
		const changeEndBg = `dayStyle[1].background`;
		//获取当前选择的时间戳
		const currentTime = e.detail.year+"-"+e.detail.month+"-"+e.detail.day;
		const currentTimestamp = new Date(currentTime).getTime();
		console.log(currentTime,currentTimestamp);
		self.setData({
			[changeDay]: dayClick,
			[changeBg]:"rgba(255,255,255,0)",
			[changeBgColor]:"black",
			[changeEndBg]: "#1DC4BC",
			currentTimestamp:currentTimestamp,//当前选中时间戳
			currentData:dayClick,//当前选中时间
		})
		self.getData();
	},
	//报表类型
	onChooseStatus:function(e){
		const self = this;
		const type = e.target.dataset.type;
		self.setData({
			currentType:type
		})
		self.getData();
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