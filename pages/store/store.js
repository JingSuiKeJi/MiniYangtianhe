// pages/store/store.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
// 初始化数据
const data = {
    banner: [],
    classList: [],
  collageList:  [
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    },
    {
      imgUrl: 'e_c.png',
      title: '养生堂VE+C',
      nowPrice: 99.00,
      prePrice: 133.00
    },
    {
      imgUrl: 'jieshibang.png',
      title: '杰士邦黄金持久避孕套套套',
      nowPrice: 59.90,
      prePrice: 99.00
    },
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    }
  ],
    currentIndex: 1,
    hotSearch:[],
    classifyType: 0,
    goodsList:[],
    BrandList: [],
    tapList:[],
    classifyId: -1,
    list: [],
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},
    second: -1,
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getClassifyList();
    self.getData();
	self.getTabBar().setData({
			selected: 1
    });
    self.getPageData();
};

// 页面onShow方法
const onShow = function (self) {
     self.getData();
};
const onUnload= function (self) {
      
}
// 页面中的方法
const methods = {
        getData: function () {
            let self = this;
            self.getClassifyList();
            Platform.getCommonData(self, {
                platformFlag:1,
            }).then((ret)=>{
                let data = ret.data;
                self.setData({
                    hotSearch: data.hotSearch,
                    banner: data.banner,
                    tapImgUrl: data.occasion.imgUrl,
                    activity: data.activity,
                })
                self.showClassify(data.navigation);
            },(err)=>{
    
            });
            Platform.getSecKill(self, {
                platformFlag:1,
            }).then((ret)=>{
               let data = ret.data;
               if (! data.length) return;
               self.setData({
                   goodsList: data.list
               });
               self.timeFormat(data.startTime, data.endTime);
            },(err)=>{
            });
            Platform.getBrandList(self, {
                platformFlag:1,
                page: 0
            }).then((ret)=>{
                let data = ret.data;
                let BrandList = [];
                let length = Math.ceil(data.length/2);
                for (var  index = 0; index < length; index++) {
                    BrandList[index]=data.slice(index*length,(index+1)*length); 
                }
                self.setData({
                    BrandList: BrandList
                });
                
            },(err)=>{
            });
        },
        onMoreTap: function (e) {
            let self = this;
            _g.navigateTo({
                url: 'pages/collage/index'
            },self)
        },
        onSkipTap: function() {
            let self = this;
            _g.navigateTo({
                url: 'pages/search/search',
                param: {platformFlag: 1}
            }, self);
        },
        onChangeTap: function(e) {
            let self = this;
            self.setData({
                currentIndex : e.detail.current
            })
        },
        onClickTap: function(e) {
            let self = this;
            self.setData({
                classifyId: e.target.dataset.id,
            })
        },
        onSlideTap: function(e) {
            let self = this;
            self.setData({
                isSlide: !self.data.isSlide
            })

        },
        onClassifyTap: function (e) {
            let self = this;
            self.setData({
                classifyType: e.detail.current,
            });
        },
        onListTap: function (e) {
            let self = this;
            _g.navigateTo({
                url: 'pages/search/classify',
            }, self);
        },
        onDetailTap: function (e) {
            let self = this;
            _g.navigateTo({
                url: 'pages/collage/detail',
            }, self);
        },
        onBrandsTap: function (e) {
            let self = this;
            _g.navigateTo({
                url: 'pages/search/brandList',
                param: {id: e.target.dataset.id}
            }, self);
        },
        onAllBrandsTap: function (e) {
            let self = this;
            _g.navigateTo({
                url: 'pages/search/brand',
            }, self);
        },
        onResultTap: function (e) {
            let self = this;
            _g.navigateTo({
            url: 'pages/search/detailList',
            param: {
                id: e.target.dataset.id,
                value: e.target.dataset.id,
                }
            }, self);
       },
        onCheckBanner: function (e) {
            let self = this;
            let id = e.target.dataset.id;
            if (e.target.dataset.isLink == 2) return;
            self.map(self.data.banner,id);
        },
        map: function (arr,id) {
            arr.forEach(element=> {
                if (element.id == id) {
                    _g.navigateTo({
                        url: element.pageUrl,
                      }, self);
                }
            });
        },
        onListTap: function (e) {
            let self = this;
            let id = e.target.dataset.id;
            if (e.target.dataset.isLink == 2) return;
            self.map(self.data.classList,id);
        },
        showClassify: function (arr) {
            let self = this;
            var  classList = [];
            var length = Math.ceil(arr.length/10);
            for (var  index = 0; index < length; index++) {
                classList[index]=arr.slice(index*10,(index+1)*10); 
            }
            self.setData({
                classList:classList
            });
        },
        onCheckActivity: function (e) {
            let self = this;
            let id = e.target.dataset.id;
            if (e.target.dataset.isLink == 2) return;
            _g.navigateTo({
                url: self.data.activity.pageUrl,
              }, self);
        },
        //限时抢购
        timeFormat: function (startTime,endTime) {
            let self = this;
            let nowDate = new Date();
            let curTime = nowDate.getTime();//指定日期距离1970年的毫秒数
            if (startTime*1000 > curTime) {
            self.setData({
                second: -1
            })
            } else {
                let second = endTime - curTime/1000;
                self.setData({
                    second: second
                });
                self.time(self.data.second);
            var timer =  setInterval(() => {
                    let second = self.data.second;
                    if(second < 0) {
                        clearInterval(timer);
                        self.setData({
                            second: -1
                        })
                    }else {
                        second--;
                        self.setData({
                            second: second
                        })
                        self.time(self.data.second);  
                    }
                },1000);
            }
        },
        // 抢购的时间
        time: function (second) {
            let day = Math.floor(second / 86400);//还剩几天
            second = second % 86400;// 剩余的秒数
            let hour = Math.floor(second / 3600);//还剩几个小时
            second = second % 3600;
            let minute = Math.floor(second /60);//还剩几分
            second = parseInt(second % 60);
            let time = {
                day:day,
                hour:hour,
                minute: minute,
                second: second
            }
            this.setData({
                time:time
            })
        },
        //榜单推荐分类列表
        getClassifyList: function () {
            let self = this;
            Platform.getClassifyList(self, {
                platformFlag:1,
                level: 2
            }).then((ret)=>{
            let data = ret.data;
            self.setData({
                tapList: data,
                classifyId: data[0].id
            })
            },(err)=>{

            });
        },
        getPageData: function () {
            let self = this;
            Platform.getRecommend(self, {
                platformFlag:1,
                page: self.data.page,
                pageSize: 10,
                classifyId: self.data.classifyId
            }).then((ret)=>{
               let data = ret.data;
               self.setData({
                   list: data.list,
               })
            },(err)=>{
    
            });
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
onUnload: onUnload
});
Page(initPage);