const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const User = require('../../service/User');
const Platform = require('../../service/Platfrom')
// 初始化数据
const data = {
    showModal: false,
    picThumb: {},
    shareCode: {},
    avatarThumb: {},
    canvasUrl: '',
    authorizeHidden: true,
    point: 10
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        point: self.data.point
    })
    self.getData();
    event.on('shop-signFinish-authorize', self, (res) => {
        if (res.detail.authSetting['scope.writePhotosAlbum']) {
            self.savePicToAlbum();
            self.setData({
                authorizeHidden: true,
                showModal: false
            });
        }
    });
};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload = function (self) {
    event.remove('shop-signFinish-authorize', self);
};
const onReady = function (self) {
    const userInfo = _g.getLS(_c.LSKeys.userInfo);
    self.setData({
        userInfo: userInfo
    })
    self.authorize = self.selectComponent('#authorize');
    self.authorize.onCancelTap = function () {
        self.setData({
            authorizeHidden: true,
        });
    }
    if (self.data.canvasUrl) return;
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

}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.getPoster();
        self.getShareCode()
    },
    getPoster: function () {
        const self = this;
        User.getPoster(self, {
            type: 4
        }).then((ret) => {
            self.setData({
                bgImg: ret.data.poster
            });
            self.downloadImg({
                imgUrl: self.data.host + ret.data.poster
            }, (res) => {
                self.setData({
                    picThumb: res
                });
                self.checkDownload();
            });

        }, (err) => {
            self.downloadImg({
                imgUrl: 'http://www.gzlingren.com:8098/yangtianhe/sign__finish.png'
            }, (res) => {
                self.setData({
                    picThumb: res
                });
                self.checkDownload();
            });

        });
    },
    //显示模态框
    showDialogBtn: function () {
        const self = this;
        self.setData({
            showModal: true
        })

    },
    //隐藏模态框
    hideModal: function () {
        const self = this;
        self.setData({
            showModal: false
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
            self.setData({
                code: ret.data.shareQR
            })
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
                            console.log(err)
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
        const ctx = wx.createCanvasContext('share', self);
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
        ctx.fillText(self.data.point, calculate(188), calculate(758))
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(18))
        ctx.fillText('福气', calculate(248), calculate(758))
        ctx.drawImage(poster.avatar, calculate(64), calculate(704), calculate(62), calculate(62))
        ctx.drawImage(poster.shareCode.path, calculate(368), calculate(684), calculate(118), calculate(118))
        ctx.setFillStyle('#FFFFFF');
        ctx.setFontSize(calculate(18))
        ctx.fillText('扫一扫识别二维码，一起来挑战吧', calculate(142), calculate(850));
        ctx.draw(true, (result) => {
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