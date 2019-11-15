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
    fridensList: [],
    stepInfo: {
        leyouNum: 0,
        points: 0,
        rank: 0,
        status: 0,
        targetStep: 0,
        todayStep: 0,
        totalStep: 0,
    },
    showModal: false,
    picThumb: {},
    shareCode: {},
    avatarThumb: {},
    canvasUrl: '',
    authorizeHidden: true,
};

// 页面onLoad方法
const onLoad = function (self) {


    if (_g.checkLogin({ type: 1 })) {
        self.getData();
    }
    self.initBlock();
    event.on('logout-suc', self, (ret) => {
        self.setData({
            step: '上传步数',
            list: [],
            BMIIndex: 0,
            test: 1,
            fridensList: [],
            stepInfo: {
                leyouNum: 0,
                points: 0,
                rank: 0,
                status: 0,
                targetStep: 0,
                todayStep: 0,
                totalStep: 0,
            }
        })
    });
    event.on('login-suc', self, (ret) => {
        self.getData();
    });
    self.getTabBar().setData({
        selected: 2
    });
    event.on('step-index-authorize', self, (res) => {
        if (res.detail.authSetting['scope.writePhotosAlbum']) {
            self.savePicToAlbum();
            self.setData({
                authorizeHidden: true,
                showModal: false
            });
        }
    });

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
 
};
const onUnload = function (self) {
    event.remove('step-index-authorize', self);
};
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.getStepInfo();
        self.getPageData();
        self.rankingList();
        self.getPoster();
        self.getShareCode();
    },
    getStepInfo: function () {
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
           
        }, (err) => { });
    },
    onIllustrationTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/me/blissDetail'
        }, self)
    },
    onCheckTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/step/myFriends'
        }, self)
    },
    onIllustrateTap: function (e) {
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
    initBlock: function () {
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
    onStepTap: function () {
        let self = this;
        if (!_g.checkLogin({ type: 2 })) return;
        wx.showLoading({
            mask: true,
            title: '正在上传步数',
            success() { }
        });
        self.wxLogin();
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
        Platform.uploadStep(self, data).then((ret) => {
            self.getData();
            wx.hideLoading();
            _g.toast({
                title: '上传步数成功',
                duration: 3000
            });
            if (self.data.stepInfo.status == 2) {
                self.showDialogBtn();
            }
        }, (err) => {

        })
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
                    step: ''
                });
                break;
        }
    },
    getPageData: function () {
        let self = this;
        User.getRecordList(self, {
            page: self.data.page,
            pageSize: 20,
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
                if (self.data.page == 1) {
                    self.setData({
                        list: data.list,
                    });
                } else {
                    self.setData({
                        list: self.data.list.concat(data.list),
                    });
                }

            }


        }, (err) => { });
    },
    rankingList: function () {
        let self = this;
        User.rankingList(self, {
            page: self.data.page,
            pageSize: 3
        }).then((ret) => {
            let data = ret.data;
            if (data.list && data.list.length) {
                self.setData({
                    fridensList: data.list,
                });
            }


        }, (err) => { });
    },
    onMoreTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/step/rankingList'
        }, self)
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
        });
    },
    //显示模态框
    showDialogBtn: function () {
        const self = this;
        self.setData({
            showModal: true
        })
        self.getTabBar().setData({
            flag: false
        });
        
    },
    //隐藏模态框
    hideModal: function () {
        const self = this;
        self.setData({
            showModal: false
        });
        self.getTabBar().setData({
            flag: true
        });
    },
    //分享给朋友
    onFriendsShare: function () {
        const self = this;
        self.hideModal();
    },
    //保存图片
    onSaveImage: function () {
        const self = this;
        _g.getAuthorize({
            type: 'scope.writePhotosAlbum'
        }, (result) => {
            if (result == undefined || result) {
                self.savePicToAlbum();
                self.hideModal();
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
        ctx.fillText('获得', calculate(148), calculate(728))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('获得', calculate(148), calculate(758))
        ctx.setFillStyle('#EA6363');
        ctx.setFontSize(calculate(23))
        ctx.fillText('3000', calculate(188), calculate(758))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('福气', calculate(248), calculate(758))
        ctx.drawImage(poster.avatar, calculate(64), calculate(704), calculate(62), calculate(62))

        //分享二维码
        // ctx.save()
        ctx.drawImage(poster.shareCode.path, calculate(368), calculate(684), calculate(118), calculate(118))
        ctx.setFillStyle('#333');
        ctx.setFontSize(calculate(18))
        ctx.fillText('扫一扫识别二维码，一起来挑战吧', calculate(142), calculate(850))
        ctx.draw(true, (res) => {
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
        const path = `pages/step/index?platformFlag=${self.data.platformFlag}`;
        return {
            title: '一起加入养天和吧',
            path: path,
            imageUrl: self.data.canvasUrl
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
    onReady: onReady,
});
Page(initPage);