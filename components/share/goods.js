const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
const event = app.event;

Component({
    options: {
        
    },
    properties: {
        isHidden: {
            type: Boolean,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    isHidden: newVal
                });
            }
        },
        goodsDetail: {
            type: Object,
            value: {},
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    goodsDetail: newVal
                });
                if (!_.isEmpty(newVal)) {
                    if (newVal.sharePoster) {
                        self.downloadImg({
                            imgUrl: self.data.host + newVal.sharePoster
                        }, (res) => {
                            self.setData({
                                bgThumb: res
                            });
                            self.checkDownload();
                        });
                    } else {
                        self.downloadImg({
                            imgUrl: 'http://www.gzlingren.com:8098/yangtianhe/' + 'bg-share.png'
                        }, (res) => {
                            self.setData({
                                bgThumb: res
                            });
                            self.checkDownload();
                        });
                    }
                    self.downloadImg({
                        imgUrl: self.data.host + newVal.picUrl,
                    }, (res) => {
                        self.setData({
                            picThumb: res
                        });
                        self.checkDownload();
                    });

                    self.getShareCode();
                }
            }
        },
        host: {
            type: String,
            value: '',
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    host: newVal
                });
            }
        },
        shareEvent: {
            type: String,
            value: '',
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    shareEvent: newVal
                });
            }
        },
        hideShareDialog: {
            type: Boolean,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    hideShareDialog: newVal
                });
            }
        },
        thirdId: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    thirdId: newVal
                });
            }
        }
    },
    ready() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        if (userInfo && userInfo.avatar) {
            self.downloadImg({
                imgUrl: userInfo.avatar,
            }, (res) => {
                self.setData({
                    avatarThumb: res
                });
                self.checkDownload();
            });
        }
    },
    data: {
        goodsDetail: {},
        host: '',
        picThumb: {},
        bgThumb: {},
        avatarThumb: {},
        canvasUrl: '',
        shareEvent: '',
        thirdId: '',
        hideShareDialog: true
    },
    methods: {
        checkDownload() {
            const self = this;
            if (!_.isEmpty(self.data.picThumb) &&
                !_.isEmpty(self.data.bgThumb) &&
                !_.isEmpty(self.data.avatarThumb)) {
                self.drawPoster();
            }
        },
        getShareCode() {
            const self = this;
            if (!_g.getUserInfo()) return;
            let sence = 'p=' + _g.getLS(_c.LSKeys.userInfo).promoCode;
            sence += '&id=' + self.data.goodsDetail.id;
            sence += '&t=' + self.data.thirdId;

            Platform.getShareQR(self, {
                scene: sence,
                page: 'pages/goods/detail'
            }).then((ret) => {

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
            _g.getAuthorize({
                type: 'scope.writePhotosAlbum'
            }, (result) => {
                if (result == undefined || result) {
                    self.savePicToAlbum();
                } else if (!result) {
                    if (_g.checkSDKVersion('2.3.0')) {
                        event.emit(self.data.eventNameAuth);
                    } else {
                        _g.showModal({
                            title: '未开启保存相册权限',
                            content: '请开启保存照片至相册权限',
                            showCancel: true,
                            confirm() {
                                wx.openSetting({
                                    complete(res) {
                                        self.savePicToAlbum();
                                    }
                                });
                            },
                            cancel() {
                                self.savePicToAlbum();
                            }
                        });
                    }
                }
            });
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
                width: 472,
                height: 840,
                avatar: self.data.avatarThumb.path,
                name: userInfo.nickname.split('')[0] + '**' + userInfo.nickname.split('')[userInfo.nickname.length-1] + '向你推荐',
                nowPrice: self.data.goodsDetail.nowPrice,
                originPrice: self.data.goodsDetail.originPrice,
                title: self.data.goodsDetail.mainTitle,
                picUrl:  self.data.picThumb.path,
                // picUrl:  self.data.host + self.data.goodsDetail.picUrl,
                bgImg: self.data.bgThumb.path,
                qrCode: '',
                size: ''
            };
            const ctx = wx.createCanvasContext('share',self)

            ctx.setFillStyle('#ffffff')
            //画背景
            ctx.drawImage(poster.bgImg, 0, 0, calculate(poster.width), calculate(poster.height))
            //线
            ctx.moveTo(calculate(60), calculate(40 + 35))
            ctx.setLineWidth(calculate(60))
            ctx.setLineCap('round')
            ctx.lineTo(calculate(412), calculate(40 + 35))
            ctx.setStrokeStyle('#ffffff')
            ctx.stroke()

            //白色框框
            ctx.moveTo(0, 0)
            ctx.rect(calculate(20), calculate(134), calculate(432), calculate(442))
            ctx.rect(calculate(20), calculate(604), calculate(432), calculate(200))
            ctx.fill()
            ctx.setFillStyle('#333333')
            ctx.setFontSize(calculate(16))
            ctx.fillText(poster.name, calculate(108), calculate(68))
            ctx.setFillStyle('#999')
            ctx.fillText('都是值得买的好货，别错过', calculate(108), calculate(82+16))
            ctx.setFillStyle('#ED3D3B')
            ctx.setFontSize(calculate(26))
            ctx.fillText('¥'+poster.nowPrice, calculate(44), calculate(614+26))
            ctx.setFillStyle('#999')
            ctx.setFontSize(calculate(16))
            ctx.fillText('¥'+poster.originPrice, calculate(44), calculate(644+24))
            ctx.setFillStyle('#333')
            ctx.setFontSize(calculate(20))
            ctx.fillText(poster.title, calculate(44), calculate(682+20))
            ctx.setFillStyle('#999')
            ctx.setFontSize(calculate(16))
            ctx.fillText(poster.size, calculate(44), calculate(720+16))
            ctx.setFillStyle('#333333')
            ctx.setFontSize(calculate(12))
            ctx.fillText(poster.size, calculate(328), calculate(746+12))

            //商品图片
            ctx.drawImage(poster.picUrl, calculate(20), calculate(134), calculate(432), calculate(442))

            //头像
            ctx.save()
            ctx.arc(calculate(22 + 30), calculate(44 + 30), calculate(60) / 2, 0, 2*Math.PI)
            ctx.clip()
            ctx.drawImage(poster.avatar, calculate(22), calculate(44), calculate(60), calculate(60))


            ctx.draw(true,(res)=>{
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
                        event.emit(self.data.shareEvent, {
                            canvasUrl: res.tempFilePath
                        });
                    }
                }, self);
            },self);

            function calculate(size) {
                return winWidth * size / UIWidth;
            }
        }
    }
});