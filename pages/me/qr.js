// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Platfrom = require('../../service/Platfrom');
let data = {
    shareQR: '',//门店二维码
    picThumb: {},
    shareCode: {},
    avatarThumb: {},
    canvasUrl: '',
    authorizeHidden: true,
};
const onLoad = function (self) {
    self.setData({
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    })
    event.on('me-qr-authorize', self, (res) => {
        if (res.detail.authSetting['scope.writePhotosAlbum']) {
            self.savePicToAlbum();
            self.setData({
                authorizeHidden: true,
                showModal: false
            });
        }
    });
    self.getData();
}
const onShow = function (self) {

}
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
        },1);
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
const onUnload = function (self) {
    event.remove('me-qr-authorize', self);
}
const methods = {
    getData: function () {
        const self = this;

        Platfrom.getShareQR(self, {
            scene: 'p=' + _g.getLS(_c.LSKeys.userInfo).promoCode,
        }).then((ret) => {
            self.downloadImg({
                imgUrl: self.data.host + ret.data.shareQR
            }, (res) => {
                self.setData({
                    shareCode: res
                });
                self.checkDownload();
            },2);
        }, (err) => {

        });
    },
    downloadImg(req, callback,type) {
        wx.downloadFile({
            url: req.imgUrl,
            success(res) {
                if (res.statusCode === 200) {
                    wx.getImageInfo({
                        src: res.tempFilePath,
                        success(result) {
                            callback && callback(result);
                        },
                        fail(err) {
                            wx.hideLoading();
                            self.getImgToast(type)
                        }
                    });
                }
            },
            fail(err) {
                self.downloadToast(type)
            }
        });
    },
    checkDownload() {
        const self = this;
        if (!_.isEmpty(self.data.shareCode) &&
            !_.isEmpty(self.data.avatarThumb)) {
            self.drawPoster();
        }

    },
    drawPoster() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        const UIWidth = 750;
        const winWidth = _g.getLS(_c.LSKeys.systemInfo).windowWidth;
        let poster = {
            avatar: self.data.avatarThumb.path,
            name: userInfo.nickname,
            shareCode: self.data.shareCode
        };
        const ctx = wx.createCanvasContext('share', self)
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, calculate(670), calculate(756));
        ctx.save()
        ctx.beginPath()
        ctx.arc(calculate(32 + 60), calculate(40 + 60), calculate(120) / 2, 0, 2 * Math.PI)
        ctx.setStrokeStyle('white')
        ctx.stroke();
        ctx.clip()
        ctx.drawImage(poster.avatar, calculate(32), calculate(40), calculate(120), calculate(120))
        ctx.restore()
        ctx.setFillStyle('#3D3D3D');
        ctx.setFontSize(calculate(34))
        ctx.fillText(poster.name, calculate(176), calculate(104))
        // //分享二维码
        // // ctx.save()
        ctx.drawImage(poster.shareCode.path, calculate(74), calculate(204), calculate(520), calculate(470))

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
    //保存图片
    onSaveImage: function () {
        const self = this;
        _g.getAuthorize({
            type: 'scope.writePhotosAlbum'
        }, (result) => {
            if (result == undefined || result) {
                // self.onSaveTap();
                self.savePicToAlbum();
            } else {
                self.setData({
                    authorizeHidden: false
                });
            }
        })
    },
    downloadToast: function (type) {
        let self = this;
        let message = '';
        switch (type) {
            case 1:
                message = '头像下载失败'
                break;
            case 2:
                message = '小程序码下载失败'
                break;
            default:
                break;
        }
        _g.toast({
            title: message,
            duration: 2000
        })
    },
    getImgToast: function (value) {
        let self = this;
        let message = '';
        switch (value) {
            case 1:
                message = '获取本地的头像失败'
                break;
            case 2:
                message = '获取本地小程序码失败'
                break;
            default:
                break;
        }
        _g.toast({
            title: message,
            duration: 2000
        })
    }

}

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onUnload: onUnload,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    temps: temps,
});
Page(initPage);