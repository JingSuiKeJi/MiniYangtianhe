// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Platform = require('../../service/Platfrom');
const Goods = require('../../service/Goods');

const data = {
    banner: [],
    classList: [],
    groupList: [],
    currentIndex: 1,
    hotSearch: [],
    classifyType: 0,
    // goodsList: [],
    secSkill: {},
    brandList: [],
    tapList: [],
    classifyId: -1,
    list: [],
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    second: -1,
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getData();
    event.on('login-suc', (ret) => {});
    event.on('logout-suc', (ret) => {});
};

// 页面onShow方法
const onShow = function(self) {
    self.getData();
};
const onUnload = function(self) {

}
// 页面中的方法
const methods = {
    getData: function() {
        const self = this;
        self.getClassifyList();
        self.getCommonData();
        self.getSecKill();
        self.getBrandList();
        self.getGroupList();
    },
    getGroupList() {
        const self = this;
        Goods.getAssembleList(self, {
            platformFlag: 1,
            page: 1,
            pageSize: 5
        }).then((ret) => {
            self.setData({
                groupList: ret.data.list
            });
        })
    },
    getCommonData() {
        const self = this;
        Platform.getCommonData(self, {
            platformFlag: 1,
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                hotSearch: data.hotSearch,
                banner: data.banner,
                tapImgUrl: data.occasion.imgUrl,
                activity: data.activity,
            })
            self.showClassify(data.navigation);
        }, (err) => {

        });
    },
    getSecKill() {
        const self = this;
        Platform.getSecKill(self, {
            platformFlag: 1,
        }).then((ret) => {
            self.setData({
                secSkill: ret.data
            });
            self.timeFormat(ret.data.startTime, ret.data.endTime);
        }, (err) => {});
    },
    getBrandList() {
        const self = this;
        Platform.getBrandList(self, {
            platformFlag: 1,
            page: 0
        }).then((ret) => {
            let data = ret.data;
            let BrandList = [];
            let length = Math.ceil(data.length / 2);
            for (var index = 0; index < 2; index++) {
                BrandList[index] = data.slice(index * length, (index + 1) * length );
            }
            self.setData({
                brandList: BrandList
            });
            console.log(3333,self.data.brandList)
        }, (err) => {});
    },
    onMoreTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/goods/groupList'
        }, self)
    },
    onSkipTap: function() {
        const self = this;
        _g.navigateTo({
            url: 'pages/search/search',
            param: { platformFlag: 1 }
        }, self);
    },
    onChangeTap: function(e) {
        const self = this;
        self.setData({
            currentIndex: e.detail.current
        })
    },
    onClickTap: function(e) {
        const self = this;
        self.setData({
            classifyId: e.target.dataset.id,
            page: 1
        });
        self.getPageData();
    },
    onSlideTap: function(e) {
        const self = this;
        self.setData({
            isSlide: !self.data.isSlide
        })
    },
    onClassifyTap: function(e) {
        const self = this;
        self.setData({
            classifyType: e.detail.current,
        });
    },
    onListTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/search/classify',
        }, self);
    },
    onDetailTap: function(e) {
        const self = this;
        const opts = e.currentTarget.dataset;
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: {
                id: opts.id,
                thirdId: opts.thirdid
            }
        }, self);
    },
    onBrandsTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/search/brandList',
            param: { id: e.target.dataset.id }
        }, self);
    },
    onAllBrandsTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/search/brand',
        }, self);
    },
    onResultTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/search/detailList',
            param: {
                id: e.target.dataset.id,
                value: e.target.dataset.id,
            }
        }, self);
    },
    onCheckBanner: function(e) {
        const self = this;
        console.log(555,e.target.dataset.index)
        let index = e.target.dataset.index;
        if (e.target.dataset.isLink == 2) return;
        self.map(self.data.banner,index);
    },
    map: function(arr, index) {
        let self = this;
        _g.navigateTo({
            url: 'pages' + arr[index].pageUrl,
        }, self);
        
    },
    onListTap: function(e) {
        const self = this;
        let id = e.target.dataset.id;
        if (e.target.dataset.isLink == 2) return;
        self.map(self.data.classList, id);
    },
    showClassify: function(arr) {
        const self = this;
        var classList = [];
        var length = Math.ceil(arr.length / 10);
        for (var index = 0; index < length; index++) {
            classList[index] = arr.slice(index * 10, (index + 1) * 10);
        }
        self.setData({
            classList: classList
        });
    },
    onCheckActivity: function(e) {
        const self = this;
        if (e.target.dataset.isLink == 2) return;
        self.map(self.data.activity,0);
    },
    //限时抢购
    timeFormat: function(startTime, endTime) {
        const self = this;
        let nowDate = new Date();
        let curTime = nowDate.getTime(); //指定日期距离1970年的毫秒数
        if (startTime * 1000 > curTime) {
            self.setData({
                second: -1
            })
        } else {
            let second = endTime - curTime / 1000;
            self.setData({
                second: second
            });
            self.time(self.data.second);
            var timer = setInterval(() => {
                let second = self.data.second;
                if (second < 0) {
                    clearInterval(timer);
                    self.setData({
                        second: -1
                    })
                } else {
                    second--;
                    self.setData({
                        second: second
                    })
                    self.time(self.data.second);
                }
            }, 1000);
        }
    },
    // 抢购的时间
    time: function(second) {
        let day = Math.floor(second / 86400); //还剩几天
        second = second % 86400; // 剩余的秒数
        let hour = Math.floor(second / 3600); //还剩几个小时
        second = second % 3600;
        let minute = Math.floor(second / 60); //还剩几分
        second = parseInt(second % 60);
        let time = {
            day: day,
            hour: hour,
            minute: minute,
            second: second
        }
        this.setData({
            time: time
        })
    },
    //榜单推荐分类列表
    getClassifyList: function() {
        const self = this;
        Platform.getClassifyList(self, {
            platformFlag: 1,
            level: 1
        }).then((ret) => {
            let data = ret.data;
            if (ret.data && ret.data.length) {
                self.setData({
                    tapList: data,
                    classifyId: data[0].id
                });
                self.getPageData();
            }
        }, (err) => {

        });
    },
    getPageData: function() {
        const self = this;
        Platform.getRecommend(self, {
            platformFlag: 1,
            page: self.data.page,
            pageSize: 10,
            classifyId: self.data.classifyId
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data.list
            })
        }, (err) => {

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