// pages/goods/groupList.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
  classfity: ['全部','中西药品','营养保健','养生花茶','情趣计生',],
  isSelect: 0,
  allList: [
    {
      url: 'tea.png',
      title: '红豆茨实薏米茶',
      useful: '用于缓解过敏性鼻炎有关的症状，如喷嚏、流鼻涕、鼻痒、鼻塞以及眼部痒及烧灼感。口服吞药药药要啊哈哈哈',
      singlePri: '19.00',
      scale: '3124',
      nowPrice: '9.99',
      personNum: '2'

    }
  ]
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getData();
};

// 页面onShow方法
const onShow = function (self) {
};

// 页面中的方法
const methods = {
	getData:function(){
		let self = this;
		self.getOccasion();
	    self.getClassifyList();
	},
	getOccasion: function () {
		let self = this;
		Platform.getOccasion(self, {
		    platformFlag:1,
		}).then((ret)=>{
		    let data = ret.data;
		    self.setData({
		        tapImgUrl: data.occasion.imgUrl,
		    })
		},(err)=>{
		
		});
	},
	getPageData: function () {
	    let self = this;
		// 拼团列表
	    Goods.getAssembleList(self, {
	        platformFlag:1,
	    	page:1,
	    	pageSize:10,
	    }).then((ret)=>{
	        let data = ret.data;
	        self.setData({
	            allList: data.list,
	        })
	    },(err)=>{
	    
	    });
	},
	getClassifyList: function () {
	    let self = this;
	    Platform.getClassifyList(self, {
	        platformFlag:1,
	        level: 1
	    }).then((ret)=>{
	       let data = ret.data;
	       self.setData({
			 classfity: data,
	         classifyId: data[0].id
		   });
		   self.getPageData();
	    },(err)=>{
	
	    });
	},
  onSelectTap: function (e) {
	let self = this;
	let opts = e.currentTarget.dataset;
    self.setData({
	  isSelect: opts.type,
	  classifyId: opts.id,
	});
	self.getPageData();
    
  },
  onSkipTap: function (e) {
    let self = this;
    console.log(22)
    _g.navigateTo({
      url: 'pages/goods/detail',
      // param: {

      // }
    },self)
  },
  onGroupTap: function (e) {
    let sefl = this;
    console.log(111);
    // _g.navigateTo({
    //   url: '#',
    //   param: {

    //   }
    // },self)
  },
};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
data: data,
onLoad: onLoad,
onShow: onShow,
methods: methods,
});
Page(initPage);