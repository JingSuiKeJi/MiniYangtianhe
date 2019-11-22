// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Store = require('../../service/Store.js');
const Platform = require('../../service/Platfrom');
const User = require('../../service/User');

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
    skillId: 0,
    stepInfo: {
        rank: 0,
        status: 0,
        targetStep: 0,
        todayStep: 0,
    },
    isLogin: false, //是否登录
    singleBrandList: [],
    BrandList: [],
    picThumb: {},
    shareCode: {},
    avatarThumb: {},
    canvasUrl: '',
    authorizeHidden: true,
    shareModal: false,
    code: ''
};

// 页面onLoad方法
const onLoad = function (self) {
    wx.showShareMenu();
    self.initBlock();
    // _g.setLS(_c.LSKeys.promoCode, 'hs23a1')

    if (_g.checkLogin({ type: 1 }) && _g.getLS(_c.LSKeys.promoCode)) {
        self.setLoginDataV2();
    } else if (_g.checkLogin({ type: 1 })) {
        self.setLoginData();
    } else {
        self.getLocation();
    }
    event.on('login-suc', self, (data) => {
        self.setLoginData();
    });
    event.on('refreshStep', self, (ret) => {
        self.getCommonData();
    });
    event.on('refreshHomeData', self, (ret) => {
        if (self.data.isLogin) {
            self.setLoginData();
        } else {
            self.setData({
                storeInfo: _g.getLS(_c.LSKeys.storeInfo)
            });
            self.getData();
        }
    });
    event.on('logout-suc', self, (ret) => {
        self.setData({
            isLogin: false
        });
        self.getStoreList();
    });
    event.on('home-index-authorize', self, (res) => {
        if (res.detail.authSetting['scope.writePhotosAlbum']) {
            self.savePicToAlbum();
            self.setData({
                authorizeHidden: true,
                showModal: false
            });
        }
    });
    self.getPoster();
    self.getShareCode();

};

const onReady = function (self) {
    if (self.data.canvasUrl) return;
    const userInfo = _g.getLS(_c.LSKeys.userInfo);
    if (userInfo && userInfo.avatar && !_g.getLS('avatarThumb')) {
        self.downloadImg({
            imgUrl: userInfo.avatar,
        }, (res) => {
            self.setData({
                avatarThumb: res
            });
            self.checkDownload();
        });
    } else {
        self.setData({
            avatarThumb: _g.getLS('avatarThumb')
        });
    }
    self.authorize = self.selectComponent('#authorize');
    self.authorize.onCancelTap = function () {
        self.setData({
            authorizeHidden: true
        });
    }
}

// 页面onShow方法
const onShow = function (self) {
    // self.onScroll('#aim', 'scrollTop');
    // self.onScroll('#head', 'headTop');

};

const onUnload = function (self) {
    event.remove('refreshStep', self);
    event.remove('login-suc', self);
    event.remove('home-index-authorize', self);
};

// 页面中的方法
const methods = {
    setLoginDataV2() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        self.setData({
            isLogin: true,
            userInfo: userInfo,
            storeInfo: userInfo.store
        });
        self.getUserLink();
    },
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
                let num = 0;
                if (self.data.storeId || storeInfo) {
                    _.find(ret.data.list, (item, index) => {
                        if (item.id == self.data.storeId) {
                            num = index
                        }

                    })
                }
                let storeInfo = ret.data.list[num];
                let lsStoreInfo = _g.getLS(_c.LSKeys.storeInfo);
                if (lsStoreInfo) {
                    storeInfo = lsStoreInfo;
                }
                self.setData({
                    storeInfo: storeInfo
                });
                _g.setLS(_c.LSKeys.storeInfo, storeInfo);
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
            let banner = data.banner.slice(0, 8);
            let opts = {
                hotSearch: data.hotSearch,
                banner: banner,
                tapImgUrl: data.occasion.imgUrl,
                stepInfo: stepInfo,
                BMIIndex: BMIIndex,
                tabList: data.navigation,
                notion: data.notion,
                navigation: data.navigation
            }
            if (data.activity.length) {
                opts.activity = data.activity;
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
            page: 1,
            pageSize: 24
        }).then((ret) => {
            let data = ret.data;
            let BrandList = [];
            if (!data.list) {
                self.setData({
                    singleBrandList: [],
                    BrandList: []
                });
                return;
            }
            if (data.list.length < 12) {
                self.setData({
                    singleBrandList: data.list
                });
            } else {
                for (var index = 0; index < 2; index++) {
                    BrandList[index] = data.list.slice(index * 12, (index + 1) * 12);
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
            if (!data.list) {
                self.setData({
                    goodsList: [],
                });
                clearInterval(self.data.timer);
            } else {
                self.setData({
                    goodsList: data.list,
                    skillId: data.id
                });
                if (!data.startTime && !data.endTime) return;
                self.timeFormat(data.startTime, data.endTime);
            };

        }, (err) => { });
    },
    //榜单推荐分类列表
    getClassifyList: function () {
        let self = this;
        Platform.getClassifyList(self, {
            platformFlag: 2,
            level: 1,
            isRecommend: 1
        }).then((ret) => {
            let data = ret.data;
            if (!data.length) {
                self.setData({
                    tapList: [],
                    list: [],
                    page: 1
                });
                return;
            }
            self.setData({
                tapList: data,
                classifyId: data[0].id
            });
            self.getPageData();
            self.onScroll('#aim', 'scrollTop');
            self.onScroll('#head', 'headTop');
            //     self.onScroll('#head', 'headTop');
            // if (pageUrl=="pages/home/index") {
            //     self.onScroll('#aim', 'scrollTop');
            //     self.onScroll('#head', 'headTop');
            // }

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
            list: [],
            page: 1
        }
        //点击下拉列表时使scroll-view的自动滑动到相对应的view
        if (!self.data.hideModal) {
            data.toView = '_' + e.currentTarget.dataset.type;
        }
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
        if (!arr.length) return;
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
        self.onPageTap(self.data.activity[0]);
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
            pageSize: 20,
            classifyId: self.data.classifyId
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
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
        if (self.data.isLogin) {
            wx.showLoading({
                mask: true,
                title: '正在上传步数',
                success() { }
            });
            self.getWeRunData();
        } else {
            _g.toast({
                title: '请登陆'
            })
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
            // self.setData({
            //     nowStep: self.data.stepInfo.todayStep
            // });
            if (ret.data.code == 11001 || ret.data.code == 11002) {
                _g.toast({ title: '重新上传步数中，请稍等' });
                self.wxLogin();
            } else {
                self.setData({
                    stepInfo: ret.data
                })
                event.emit('refreshStep');
                wx.hideLoading();
                _g.toast({
                    title: '上传步数成功',
                    duration: 3000
                });
                if (ret.data.status == 2) {
                    self.showDialogBtn();
                }
            }

            // self.getCommonData();
            // if (self.data.stepInfo.status == 2) {
            //     self.showDialogBtn();
            // }
            
        }, (err) => {
        })
    },

    onScroll: function (id, value) {
        const self = this;
        const query = wx.createSelectorQuery();
        setTimeout(() => {
            query.select(id).boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function (res) {
                self.setData({
                    [value]: res[0].top
                });
            });
        }, 1000);


    },
    pageScroll: function (res) {
        let self = this;
        let top = self.data.scrollTop - self.data.headTop;
        if (res.scrollTop >= top && !self.data.isFixed) {
            self.setData({
                isFixed: true,
            })
        } else if (res.scrollTop < top && self.data.isFixed) {
            self.setData({
                isFixed: false,
            })
        }

    },

    onMapTap() {
        const self = this;
        if (self.data.storeInfo.isBind) return;
        _g.navigateTo({
            url: 'pages/home/map'
        }, self);
        // if (self.data.userInfo.storeInfo) {
        //     _g.navigateTo({
        //         url: 'pages/home/map'
        //     }, self);
        // } else {
        //     _g.toast({
        //         title: '已绑定门店'
        //     });
        // }
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
                        id: data.otherId
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
                    url: 'pages/search/classify',
                    param: param
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
    },
    getPoster: function () {
        const self = this;
        User.getPoster(self, {
            type: 3
        }).then((ret) => {
            self.downloadImg({
                imgUrl: self.data.host + ret.data.poster
            }, (res) => {
                self.setData({
                    picThumb: res
                });
            });
            self.checkDownload();
        }, (err) => {
            self.downloadImg({
                imgUrl: 'http://www.gzlingren.com:8098/yangtianhe/share__step__bgImg.png'
            }, (res) => {
                self.setData({
                    picThumb: res
                });
            });
            self.checkDownload();
        });
    },
    //显示模态框
    showDialogBtn: function () {
        const self = this;
        self.setData({
            shareModal: true
        })
        self.getTabBar().setData({
            flag: false
        });

    },
    //隐藏模态框
    hideShareModal: function () {
        const self = this;
        self.setData({
            shareModal: false
        });
        self.getTabBar().setData({
            flag: true
        });
    },
    //分享给朋友
    onFriendsShare: function () {
        const self = this;
        self.hideShareModal();
    },
    //保存图片
    onSaveImage: function () {
        const self = this;
        _g.getAuthorize({
            type: 'scope.writePhotosAlbum'
        }, (result) => {
            if (result == undefined || result) {
                // self.onSaveTap();
                self.savePicToAlbum();
                // self.hideShareModal();
            } else {
                self.setData({
                    authorizeHidden: false
                });
            }
        })
    },
    checkDownload() {
        const self = this;
        if (!_.isEmpty(self.data.picThumb) &&
            !_.isEmpty(self.data.avatarThumb) &&
            !_.isEmpty(self.data.shareCode)) {
            self.drawPoster();
        }

    },
    getShareCode() {
        const self = this;
        if (!_g.getUserInfo()) return;
        let sence = 'p=' + _g.getLS(_c.LSKeys.userInfo).promoCode;

        Platform.getShareQR(self, {
            scene: sence,
            page: 'pages/home/index'
        }).then((ret) => {
            self.downloadImg({
                imgUrl: self.data.host + ret.data.shareQR
            }, (res) => {
                self.setData({
                    shareCode: res
                });
                self.checkDownload();
            });

        }, (err) => {

        });
    },
    openSettingTap(e) {

    },
    downloadImg(req, callback) {
        wx.downloadFile({
            url: req.imgUrl,
            success(res) {
                if (res.statusCode === 200) {
                    wx.getImageInfo({
                        src: res.tempFilePath,
                        success(res) {
                            callback && callback(res);
                        },
                        fail(err) {
                            wx.hideLoading();
                        }
                    });
                }
            }
        });
    },
    onSaveTap() {
        const self = this;
    },
    savePicToAlbum() {
        const self = this;
        wx.saveImageToPhotosAlbum({
            filePath: self.data.canvasUrl,
            success(res) {
                _g.toast({
                    icon: 'success',
                    title: '图片保存成功'
                });
            },
            fail(err) {
                _g.toast({
                    title: '图片保存失败'
                });
            }
        });
    },
    drawPoster() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        const UIWidth = 750;
        const winWidth = _g.getLS(_c.LSKeys.systemInfo).windowWidth;
        let poster = {
            avatar: self.data.avatarThumb.path,
            name: userInfo.nickname,
            picUrl: self.data.picThumb.path,
            shareCode: self.data.shareCode
        };
        const ctx = wx.createCanvasContext('share', self)
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, calculate(552), calculate(900))
        //画背景
        ctx.drawImage(poster.picUrl, 0, 0, calculate(552), calculate(900))
        ctx.setFillStyle('white')
        ctx.fillRect(calculate(36), calculate(670), calculate(476), calculate(142))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('恭喜您已完成今日目标', calculate(148), calculate(728))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('获得', calculate(148), calculate(758))
        ctx.setFillStyle('#EA6363');
        ctx.setFontSize(calculate(23))
        ctx.fillText('3000', calculate(188), calculate(758))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('福气', calculate(248), calculate(758));
        ctx.save()
        ctx.beginPath()
        ctx.arc(calculate(64 + 31), calculate(704 + 31), calculate(62) / 2, 0, 2 * Math.PI)
        ctx.setStrokeStyle('white')
        ctx.stroke();
        ctx.clip()
        ctx.drawImage(poster.avatar, calculate(64), calculate(704), calculate(62), calculate(62))
        ctx.restore()
        //分享二维码
        // ctx.save()
        ctx.drawImage(poster.shareCode.path, calculate(368), calculate(684), calculate(118), calculate(118))
        ctx.setFillStyle('#333');
        ctx.setFontSize(calculate(18))
        ctx.fillText('扫一扫识别二维码，一起来挑战吧', calculate(142), calculate(850))
        ctx.draw(false, (res) => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: calculate(poster.width) * 4,
                height: calculate(poster.height) * 4,
                destWidth: poster.width * 2,
                destHeight: poster.height * 2,
                canvasId: 'share',
                success(res) {
                    self.setData({
                        canvasUrl: res.tempFilePath
                    });
                    // _g.setLS('myPosterUrl', res.tempFilePath);
                }
            }, self);
        }, self);

        function calculate(size) {
            return winWidth * size / UIWidth;
        }
    },
    onShareAppMessage() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        const path = `pages/home/login?promoCode=${userInfo.promoCode}`;
        return {
            title: '一起加入养天和吧',
            path: path,
            imageUrl: self.data.canvasUrl
        }
    },
    setUserLinkData(ret) {
        const self = this;
        _g.rmLS(_c.LSKeys.promoCode);
        if (ret.data.result == 2) {
            // 无登录 往上找 有门店
            _g.setLS(_c.LSKeys.storeInfo, ret.data.storeInfo);
            self.setData({
                storeInfo: storeInfo
            })
            //TODO get info
        } else if (ret.data.result == 1) {
            //登陆了 需要刷新门店
            _g.getMyInfo(self, {
                suc() {
                    self.setData({
                        userInfo: _g.getLS(_c.LSKeys.userInfo),
                        storeInfo: _g.getLS(_c.LSKeys.userInfo).store
                    });
                    _g.setLS(_c.LSKeys.storeInfo, _g.getLS(_c.LSKeys.userInfo).store);
                    self.getData();
                }
            })
        } else {
            //小白 和之前一样处理
            if (self.data.isLogin) {
                let userInfo = _g.getLS(_c.LSKeys.userInfo);
                if (!userInfo.store) {
                    self.getLocation();
                } else {
                    self.getData();
                }
            } else {
                self.getLocation();
            }
        }
    },
    getUserLink() {
        const self = this;
        let postData = {
            promoCode: _g.getLS(_c.LSKeys.promoCode)
        };

        // if (self.data.isLogin) {
        postData.userId = self.data.userInfo.id;
        User.userLinkUser(self, postData).then((ret) => {
            self.setUserLinkData(ret);
        }, (err) => {
            //TODO 失败
        });
        // } else {
        //     wx.login({
        //         success(res) {
        //             if (res.code) {
        //                 postData.jsCode = res.code;
        //                 User.userLinkUser(self, postData).then((ret) => {
        //                     self.setUserLinkData(ret);
        //                 }, (err) => {
        //                     //TODO 失败
        //                 });
        //             } else {
        //                 //TODO 微信登陆失败
        //             }
        //         }
        //     })
        // }
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