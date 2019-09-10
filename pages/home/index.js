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
    step: '',
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
    BMIIndex: 0,//养步乐进度条
    second: -1,
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},
    isFixed:  false,
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getClassifyList();
    self.getData();
    self.initBlock();
    self.getPageData();
};

const onReady = function(self) {
    self.onScroll();
    
}

// 页面onShow方法
const onShow = function (self) {
    self.getData();
};
const onUnload= function (self) {
    _g.getPrevPage().setData({
        num: self.data.value
    })
};
// const onPageScroll = function (self) {
//     // console.log(111,self);
//     console.log(res.scrollTop)    
// };
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        Platform.getCommonData(self, {
            platformFlag:2,
            storeId: 1
        }).then((ret)=>{
            let data = ret.data;
            let stepInfo = data.stepInfo;
            let  percent = stepInfo.todayStep/stepInfo.targetStep;
            let BMIIndex = Math.ceil(31 * percent);
            self.setData({
                hotSearch: data.hotSearch,
                banner: data.banner,
                tapImgUrl: data.occasion.imgUrl,
                activity: data.activity,
                stepInfo: stepInfo,
                BMIIndex: BMIIndex
            });
            
            self.btnShow(data.stepInfo.status);
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
            for (var  index = 0; index < 2; index++) {
                BrandList[index]=data.slice(index*length,(index+1)*length-1); 
            }
            self.setData({
                BrandList: BrandList
            });
            
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
   
    btnShow: function (status) {
        let self = this;
        switch( status) {
            case 1 :
                self.setData({
                    step : '上传步数'
                });
                break;
            case 2 :
                    self.setData({
                        step : '已领取'
                    });
                    break;
            default: 
                    self.setData({
                        step : '领取积分'
                    });
                    break;
        }
    },
  
    onSkipTap: function() {
        let self = this;
        _g.navigateTo({
          url: 'pages/search/search',
          param: {
            platformFlag: 2,
            storeId: 1
          }
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
          url: 'pages/goods/detail',
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
          blockList: blockList,
         
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
            storeId: 1,
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
    },
    onStepTap: function(){
        let self = this;
        if (self.data. stepInfo.status == 1) {
            Platfrom.uploadStep(self,{
                step: self.data.stepInfo.todayStep
            }).then((ret) => {
                self.getData();
            },(err) => {
             
            })
        } else {
            return false;
        }
        
    },
    onScroll: function () {
        const self = this;
        const query = wx.createSelectorQuery();
        query.select('#aim').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function(res){
            self.setData({
                scrollTop: res[0].top
            })
        })
    },
    pageScroll: function (res) {
        let self = this;
        let top = self.data.scrollTop - 80;
        if (res.scrollTop >= top) {
            self.setData({
                isFixed:  true,
            })
        }else {
            self.setData({
                isFixed:  false,
            }) 
        }
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
    onUnload: onUnload,
    onReady: onReady
});
Page(initPage);