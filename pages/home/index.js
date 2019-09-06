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
    step: '上传步数',
    currentIndex:1,
    classifyType: 0,
    hotSearch:[],
    goodsList: [],
    tapList:[],
    classifyId: -1,
    list: [],
    isSlide: false,
    blockList: [{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        coverColor: ''
    }],
    BMIIndex: 20,
    second: -1,
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},
};

// 页面onLoad方法
const onLoad = function (self) {
    _g.getLocation().then((data)=>{
        let lat = data.latitude;
        let lon = data.longitude;
        self.getStoreList(lat,lon);
    });//获取定位
    self.getClassifyList();
    self.getData();
    self.initBlock();
    self.getStoreInfo();
    self.getPageData();
    // self.timeFormat('1567565880', '1567699200');
    
};

// 页面onShow方法
const onShow = function (self) {
    self.getData();
};
const onUnload= function (self) {
    _g.getPrevPage().setData({
        num: self.data.value
    })
}
// 页面中的方法
const methods = {
    getData: function () {
        var self = this;
        Platform.getCommonData(self, {
            platformFlag:2,
            storeId: 234567
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
            platformFlag:2,
            storeId: 234567
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
            platformFlag:2,
            storeId: 234567,
            page: 0
        }).then((ret)=>{
            let data = ret.data;
            let BrandList = [];
            let length = Math.ceil(data.length/2);
            console.log(22,length)
            for (var  index = 0; index < length; index++) {
                BrandList[index]=data.slice(index*length,(index+1)*length+1); 
            }
            self.setData({
                BrandList: BrandList
            });
            
        },(err)=>{
        });

    },
    // 获取门店列表
    getStoreList: function (lat, lon) {
        let self = this;
        Platform.getStoreList(self, {
            page: 1,
            pageSize: 10,
            lon: lon,
            lat: lat
        }).then((ret)=>{
            let data = ret.data;
            self.setData({
                storeList: data.list
            })
        },(err)=>{

        });
    },
    //榜单推荐分类列表
    getClassifyList: function () {
        let self = this;
        Platform.getClassifyList(self, {
            platformFlag:2,
            storeId: 234567,
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
    //获取门店详情
    getStoreInfo: function () {
        Platform.getStoreInfo(self, {

        }).then((ret)=>{
           
        },(err)=>{

        });
    },
    onStepTap: function (e) {
        let self = this;
        wx.getWeRunData({
            success (res) {
              console.log(res)
            }
        })
        // if (self.data.step == '上传步数') {
        //     self.setData({
        //         step : '上传中'
        //     })
        // } else if (self.data.step == '上传中') {
        //   self.setData({
        //     step : '领取积分'
        //   })
        // } else if(self.data.step == '领取积分') {
        //   self.setData({
        //     step : '已领取'
        //   })
        // }else {
        //   wx.showToast({
        //     title: '你已领取积分',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
    },
  
    onSkipTap: function() {
        let self = this;
        _g.navigateTo({
          url: 'pages/search/search',
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
    onSkipTap: function() {
        let self = this;
        _g.navigateTo({
          url: 'pages/search/search',
        }, self);
    },
    onChangeTap: function(e) {
        let self = this;
        self.setData({
          currentIndex : e.detail.current
        })
    },
    onClassifyTap: function (e) {
        let self = this;
        self.setData({
        classifyType: e.detail.current,
        });
    },
    onClickTap: function(e) {
        let self = this;
        // console.log(e.target.dataset.type)
        self.setData({
          classifyId: e.target.dataset.id,
        })
    },
    onSlideTap: function(e) {
        let self = this;
        self.setData({
            hideModal: !self.data.hideModal
        })
    },
    onAllBrandsTap: function (e) {
        let self = this;
        _g.navigateTo({
          url: 'pages/search/brand',
        }, self);
    },
    onListTap: function (e) {
        let self = this;
        let id = e.target.dataset.id;
        if (e.target.dataset.isLink == 2) return;
        self.map(self.data.classList,id);
    },
    onDetailTap: function (e) {
        let self = this;
        _g.navigateTo({
          url: 'pages/collage/detail',
          param: {
              id: e.target.dataset.id,
            }
        }, self);
    },
    onBrandsTap: function (e) {
        console.log( 333,e.target.dataset.id);
        let self = this;
        _g.navigateTo({
          url: 'pages/search/brandList',
          param: {id: e.target.dataset.id}
        }, self);
    },
    initBlock: function () {
        let self = this;
        var blockList = [];
        for (var i = 0; i < 31; i++) {
          if (i <= 14) {
          var a = 130;
          } else if (i == 15) {
          var a = 0;
          } else if (i >= 16) {
          var a = 130;
          }
          var rotate = ((a / 15) * i - a).toFixed(0);
          //y = y0 + r * sin(a * pi / 180)
          //x = x0 + r * cos(a * pi / 180)
          //(x0, y0) ==> (0, 0)
        var left =  (1.4* Math.sin(rotate * Math.PI / 180)).toFixed(2);
        var bottom =  (1.4 * Math.cos(rotate * Math.PI / 180)).toFixed(2);
          blockList.push({
          bottom: bottom,
          left: left,
          rotate: rotate
          });
        }
        self.setData({
          blockList: blockList
        })
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
    onCheckBanner: function (e) {
        let self = this;
        let id = e.target.dataset.id;
        if (e.target.dataset.isLink == 2) return;
        self.map(self.data.banner,id);
    },
    onCheckActivity: function (e) {
        let self = this;
        let id = e.target.dataset.id;
        if (e.target.dataset.isLink == 2) return;
        _g.navigateTo({
            url: self.data.activity.pageUrl,
          }, self);
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
     // 显示遮罩层
    showModal: function () {
        let self=this;
        self.setData({
            hideModal:false
        }) 
    },
  
    // 隐藏遮罩层
    hideModal: function () {
        var self=this; 
        self.setData({
            hideModal:true,
        })    
    },
    getPageData: function () {
        let self = this;
        Platform.getRecommend(self, {
            platformFlag:2,
            storeId: 234567,
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
    onResultTap: function (e) {
       let self = this;
       _g.navigateTo({
        url: 'pages/search/detailList',
        param: {
            id: e.target.dataset.id,
            value: e.target.dataset.id,
          }
      }, self);
    }
    
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