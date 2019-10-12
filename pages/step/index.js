// pages/step/index.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Platform = require('../../service/Platfrom');
const User = require('../../service/User');
// 初始化数据
const data = {
    step: '上传步数',
    list: [],
    BMIIndex: 0,
    test: 1,
    fridensList: []
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getData();
    self.initBlock();
    event.on('refreshStep', self, (ret) => {
        self.getData();
    });
    self.getTabBar().setData({
        selected: 2
    });
};

// 页面onShow方法
const onShow = function(self) {
    event.emit('refreshStep');
};
const onUnload = function(self) {
    event.remove('refreshStep');
};
// 页面中的方法
const methods = {
    getData: function() {
        let self = this;
        self.getStepInfo();
        self.getPageData();
        self.rankingList();
    },
    getStepInfo: function() {
        let self = this;
        Platform.getStepInfo(self, {}).then((ret) => {
            let stepInfo = ret.data.stepInfo;
            let percent = stepInfo.todayStep / stepInfo.targetStep;
            let BMIIndex = Math.ceil(31 * percent);
            self.setData({
                stepInfo: stepInfo,
                BMIIndex: BMIIndex
            });
            self.btnShow(stepInfo.status);
        }, (err) => {});
    },
    onIllustrationTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/blissDetail'
        }, self)
    },
    onCheckTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/step/myFriends'
        }, self)
    },
    onIllustrateTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/home/notice',
            param: {
                urlParam: `type=article&id=pointsRule`
            }
        }, self);
        // _g.navigateTo({
        //     url: 'pages/step/illustration'
        // }, self)
    },
    initBlock: function() {
        let self = this;
        let blockList = [];
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
                //  bottom: 0,
                // left: 0,
                bottom: bottom,
                left: left,
                rotate: rotate
            });
        }
        self.setData({
            blockList: blockList,
        })
    },
    onStepTap: function() {
        let self = this;
        if (self.data.stepInfo.status != 1) return;
        wx.showLoading({
            mask: true,
            title: '正在上传步数',
            success() {}
        });
        self.wxLogin();
    },
    wxLogin: function() {
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
    getWeRunData: function() {
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
    uploadStep: function(data) {
        let self = this;
        Platform.uploadStep(self, data).then((ret) => {
            self.getData();
            wx.hideLoading();
            _g.toast({
                title: '上传步数成功',
                duration: 3000
            });
        }, (err) => {

        })
    },
    btnShow: function(status) {
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
                    step: ''
                });
                break;
        }
    },
    getPageData: function() {
        let self = this;
        User.getRecordList(self, {
            page: self.data.page,
            pageSize: 15
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
                self.setData({
                    list: data.list,
                    hasNextPage: data.hasNextPage
                });
            }
           

        }, (err) => {});
    },
    rankingList: function() {
        let self = this;
        User.rankingList(self, {
            page: self.data.page,
            pageSize: 5
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
                self.setData({
                    fridensList: data.list,
                });
            }
           

        }, (err) => {});
    },
    onMoreTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/step/rankingList'
        },self)
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