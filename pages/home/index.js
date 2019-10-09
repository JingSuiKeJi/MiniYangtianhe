// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Store = require('../../service/Store.js');
const Platform = require('../../service/Platfrom');

// 初始化数据
const data = {
    userInfo: {},
    storeInfo: {},
    isLogin: false,
    location: {
        lon: 112.59000,
        lat: 28.12000
    },
    banner: [],
    classList: [],
    step: '',
    currentIndex: 1,
    classifyType: 0,
    hotSearch: [],
    goodsList: [],
    tapList: [],
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
    BMIIndex: 0, //养步乐进度条
    second: -1,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    isFixed: false,
    nowStep: 0,
    skillId: 0
};

// 页面onLoad方法
const onLoad = function (self) {
    self.initBlock();
    if (_g.checkLogin({
        type: 1
    })) {
        //已登录
        self.setLoginData();
    } else {
        //未登录
        self.getLocation();
    }
    event.on('login-suc', self, (data) => {
        self.setLoginData();
    });
    event.on('refreshStep', self, (ret) => {
        self.getCommonData();
    });
    event.on('refreshHomeData', self, (ret) => {
        self.setData({
            storeInfo: _g.getLS(_c.LSKeys.storeInfo)
        });
        self.getData();
    });
};

const onReady = function (self) {
    self.onScroll();

}

// 页面onShow方法
const onShow = function (self) {
    // self.getData();
};

const onUnload = function (self) {
    event.remove('refreshStep');
    event.remove('login-suc');
};

// 页面中的方法
const methods = {
    setLoginData() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        self.setData({
            isLogin: true,
            userInfo: userInfo,
            storeInfo: userInfo.store
        });
        if (!userInfo.store) {
            self.getLocation();
        } else {
            self.getData();
        }
    },
    getLocation() {
        const self = this;
        _g.getLocation().then((res) => {
            self.setData({
                location: {
                    lon: res.lon,
                    lat: res.lat
                }
            });
            self.getStoreList();
        }, (error) => {
            self.getStoreList();
        });
    },
    getStoreList() {
        const self = this;
        Store.storeList(self, {
            page: 1,
            pageSize: 1,
            lon: self.data.location.lon,
            lat: self.data.location.lat
        }).then((ret) => {
            if (ret.data.list && ret.data.list.length) {
                self.setData({
                    storeInfo: ret.data.list[0]
                });
                _g.setLS(_c.LSKeys.storeInfo, ret.data.list[0]);
                self.getData();
            }
        });
    },
    getData() {
        const self = this;
        self.getCommonData();
        self.getBrandList();
        self.getSecKill();
        self.getClassifyList();
    },
    getCommonData() {
        const self = this;
        Platform.getCommonData(self, {
            platformFlag: 2,
        }).then((ret) => {
            let data = ret.data;
            let stepInfo = data.stepInfo;
            let percent = stepInfo.todayStep / stepInfo.targetStep;
            let BMIIndex = Math.ceil(31 * percent);
            // if (self.data.nowStep == stepInfo.todayStep) {
            //     _g.toast({
            //         title: '暂时没有获取到最新的微信运动数据, 请稍后再试'
            //     });
            // }
             let opts = {
                hotSearch: data.hotSearch,
                banner: data.banner,
                tapImgUrl: data.occasion.imgUrl,
                stepInfo: stepInfo,
                BMIIndex: BMIIndex,
                tabList: data.navigation,
                notion: data.notion,
                navigation: data.navigation
             }
             if (data.activity.length) {
                opts.activity = data.activity[0];
             }
            self.setData(opts);

            self.btnShow(data.stepInfo.status);
            self.showClassify(data.navigation);
        }, (err) => {

        });
    },
    getBrandList() {
        const self = this;
        Platform.getBrandList(self, {
            platformFlag: 2,
            page: 0
        }).then((ret) => {
            let data = ret.data;
            let BrandList = [];
            if (data.length < 12) {
                self.setData({
                    singleBrandList: data
                });
            } else {
                for (var index = 0; index < 2; index++) {
                    BrandList[index] = data.slice(index * 12, (index + 1) * 12);
                }
                self.setData({
                    brandList: BrandList
                });
            }


        }, (err) => { });
    },
    getSecKill() {
        const self = this;
        Platform.getSecKill(self, {
            platformFlag: 2,
        }).then((ret) => {
            let data = ret.data;
            if (!data.list) return;
            self.setData({
                goodsList: data.list,
                skillId: data.id
            });
            self.timeFormat(data.startTime, data.endTime);
        }, (err) => { });
    },
    //榜单推荐分类列表
    getClassifyList: function () {
        let self = this;
        Platform.getClassifyList(self, {
            platformFlag: 2,
            level: 1
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                tapList: data,
                classifyId: data[0].id
            });
            self.getPageData();
        }, (err) => {

        });
    },

    btnShow: function (status) {
        let self = this;
        switch (status) {
            case 1:
                self.setData({
                    step: '上传步数'
                });
                break;
            case 2:
                self.setData({
                    step: '已领取'
                });
                break;
            default:
                self.setData({
                    step: '领取积分'
                });
                break;
        }
    },

    onSkipTap: function () {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/search',
            param: {
                platformFlag: 2,
            }
        }, self);
    },
    //限时抢购
    timeFormat: function (startTime, endTime) {
        let self = this;
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
            clearInterval(self.data.timer);
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
            self.setData({
                timer: timer
            })
        }
    },
    // 抢购的时间
    time: function (second) {
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
    onChangeTap: function (e) {
        let self = this;
        self.setData({
            currentIndex: e.detail.current
        })
    },
    onClassifyTap: function (e) {
        let self = this;
        self.setData({
            classifyType: e.detail.current,
        });
    },
    onClickTap: function (e) {
        let self = this;
        let data = {
            classifyId: e.currentTarget.dataset.type,
        }
        //点击下拉列表时使scroll-view的自动滑动到相对应的view
        if (!self.data.hideModal) {
            data.toView = '_' + e.currentTarget.dataset.type;
        }
        self.setData({
            list: []
        })
        self.setData(data);
        self.getPageData();
        self.hideModal();
    },
    onSlideTap: function (e) {
        let self = this;
        self.setData({
            hideModal: !self.data.hideModal
        })
    },
    onAllBrandsTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/brand',
            param: {
                platformFlag: 2
            }
        }, self);
    },
    onTabTap: function (e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        if (opts.isLink == 2) return;
        _.each(self.data.navigation, (item) => {
             if (item.id == opts.id) {
                self.onPageTap(item);
                return;
            }
           
        });

    },
    onDetailTap: function (e) {
        let self = this;
        const opts = e.currentTarget.dataset;
        _g.navigateTo({
            url: 'pages/goods/detail',
            param: {
                id: opts.id,
                thirdId: opts.thirdid
            }
        }, self);
    },
    onBrandsTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/brandList',
            param: {
                id: e.target.dataset.id,
                platformFlag: 2
            }
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
            var left = (1.4 * Math.sin(rotate * Math.PI / 180)).toFixed(2);
            var bottom = (1.4 * Math.cos(rotate * Math.PI / 180)).toFixed(2);
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
        var classList = [];
        var length = Math.ceil(arr.length / 10);
        for (var index = 0; index < length; index++) {
            classList[index] = arr.slice(index * 10, (index + 1) * 10);
        }
        self.setData({
            classList: classList
        });
    },
    onGoTap: function (e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        let index = opts.index;
        if (opts.isLink == 2) return;
        self.onPageTap(self.data.banner[index]);
    },
    onCheckActivity: function (e) {
        let self = this;
        if (e.currentTarget.dataset.isLink == 2) return;
        self.onPageTap(self.data.activity);
    },
    map: function (arr, index) {
        let self = this;
        _g.navigateTo({
            url: 'pages' + arr[index].pageUrl,
        }, self);

    },
    // 显示遮罩层
    showModal: function () {
        let self = this;
        self.setData({
            hideModal: false
        })
    },

    // 隐藏遮罩层
    hideModal: function () {
        var self = this;
        self.setData({
            hideModal: true,
        })
    },
    getPageData: function () {
        let self = this;
        Platform.getRecommend(self, {
            platformFlag: 2,
            page: self.data.page,
            pageSize: 10,
            classifyId: self.data.classifyId
        }).then((ret) => {
            let data = ret.data;
            if (ret.data.list && ret.data.list.length) {
                if (self.data.page == 1) {
                    self.setData({
                       list: data.list,
                    })
                } else {
                    self.setData({
                       list: self.data.list.concat(data.list),
                    })
                }
            }
            
        }, (err) => {

        });
    },
    onResultTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/detailList',
            param: {
                id: e.target.dataset.id,
                value: e.target.dataset.value,
                platformFlag: 2
            }
        }, self);
    },
    onStepTap: function () {
        let self = this;
        if (self.data.stepInfo.status == 1) {
            wx.showLoading({
                mask: true,
                title: '正在上传步数',
                success() {}
            });
            self.wxLogin();
        } else {
            return false;
        }

    },
    wxLogin: function () {
        let self = this;
        wx.login({
            success(res) {
                if (res.code) {
                    self.setData({
                        code: res.code
                    })
                    self.getWeRunData();
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    getWeRunData: function () {
        const self = this;
        wx.getWeRunData({
            success(res) {
                let data = {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    jsCode: self.data.code
                };
                self.uploadStep(data)
            }
        })

    },
    uploadStep: function (data) {
        let self = this;
        Platform.uploadStep(self, data
        ).then((ret) => {
            self.setData({
                nowStep: self.data.stepInfo.todayStep
            });
            event.emit('refreshStep');
            wx.hideLoading();
            _g.toast({
                title: '上传步数成功',
                duration: 3000
            });
            self.getCommonData();
        }, (err) => {
            _g.toast({
                title: '上传步数失败'
            });
        })
    },

    onScroll: function () {
        const self = this;
        const query = wx.createSelectorQuery();
        if (!self.data.tapList.length) return;
        setTimeout(() => {
            query.select('#aim').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function (res) {
                self.setData({
                    scrollTop: res[0].top
                });
            });
        }, 1000);

    },
    pageScroll: function (res) {
        let self = this;
        let top = self.data.scrollTop-80;
        if (res.scrollTop >= top) {
            self.setData({
                isFixed: true,
            })
        } else {
            self.setData({
                isFixed: false,
            })
        }
    },
    onMapTap() {
        const self = this;
        if (self.data.userInfo.storeInfo) {
            _g.navigateTo({
                url: 'pages/home/map'
            }, self);
        } else {
            _g.toast({
                title: '已绑定门店'
            });
        }
    },
    onPageTap: function (data) {
        let self = this;
        let param = {
            platformFlag: 2
        };
        switch (data.linkType) {
            case 1:
                _g.navigateTo({
                    url: 'pages/goods/detail',
                    param: {
                        id:data.otherId 
                    }
                }, self);
                break;
            case 2:
                //搜索结果
                param.classifyId = data.otherId;
                _g.navigateTo({
                    url: 'pages/search/detailList',
                    param: param
                }, self);
                break;
            case 3:
                //拼团首页
                _g.navigateTo({
                    url: 'pages/goods/groupList',
                    param: param
                }, self);
                break;
            case 4:
                //砍价页面
                _g.navigateTo({
                    url: 'pages/goods/bargainList',
                    param: param
                }, self);
                break;
            case 5:
                //权益卡首页
                _g.navigateTo({
                    url: 'pages/card/card',
                    param: param
                }, self);
                break; 
            case 6:
                //全部分类
                _g.navigateTo({
                    url: 'pages/search/classify'
                }, self);
                break;                
            default:
                break;
        }
    },
    onNoticTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/home/notice',
            param: {
                id: e.currentTarget.dataset.id,
                urlParam: `type=notice&id=${e.currentTarget.dataset.id}`
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
    onUnload: onUnload,
    onReady: onReady
});
Page(initPage);