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
                    } else if (_g.getLS('goodsPosterBg')) {
                        self.setData({
                            bgThumb: _g.getLS('goodsPosterBg')
                        });
                    } else {
                        self.downloadImg({
                            imgUrl: 'https://app.yth-yx.com/mini/' + 'bg-share.png'
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
        },
        userCutId: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    userCutId: newVal
                });
            }
        },
        eventNameAuth: {
            type: String,
            value: '',
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    eventNameAuth: newVal
                });
            }
        }
    },
    ready() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        if (_g.getLS('avatarThumb')) {
            self.setData({
                avatarThumb: _g.getLS('avatarThumb')
            });
            self.checkDownload();
        } else if (userInfo && userInfo.avatar) {
            self.downloadImg({
                imgUrl: userInfo.avatar,
            }, (res) => {
                self.setData({
                    avatarThumb: res
                });
                _g.setLS('avatarThumb', res);
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
        userCutId: 0,
        hideShareDialog: true,
        shareCode: {}
    },
    methods: {
        checkDownload() {
            const self = this;
            if (!_.isEmpty(self.data.picThumb) &&
                !_.isEmpty(self.data.bgThumb) &&
                !_.isEmpty(self.data.avatarThumb) &&
                !_.isEmpty(self.data.shareCode)) {
                self.drawPoster();
            }
        },
        getShareCode() {
            const self = this;
            if (!_g.getUserInfo()) return;
            let sence = 'p=' + _g.getLS(_c.LSKeys.userInfo).promoCode;
            sence += '&id=' + self.data.goodsDetail.id;
            sence += '&t=' + self.data.thirdId;
            if (self.data.userCutId) sence += '&c=' + self.data.userCutId;
            let path = '';
            if (!self.data.userCutId) {
                path = 'pages/goods/detail';
            } else {
                path = 'pages/goods/bargain';
            }
            Platform.getShareQR(self, {
                scene: sence,
                page: path
            }).then((ret) => {
                self.downloadImg({
                    imgUrl: self.data.host +  ret.data.shareQR
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

            let rsAstralRange = '\\ud800-\\udfff',
                rsZWJ = '\\u200d',
                rsVarRange = '\\ufe0e\\ufe0f',
                rsComboMarksRange = '\\u0300-\\u036f',
                reComboHalfMarksRange = '\\ufe20-\\ufe2f',
                rsComboSymbolsRange = '\\u20d0-\\u20ff',
                rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
            let reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');

            let rsFitz = '\\ud83c[\\udffb-\\udfff]',
                rsOptVar = '[' + rsVarRange + ']?',
                rsCombo = '[' + rsComboRange + ']',
                rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
                reOptMod = rsModifier + '?',
                rsAstral = '[' + rsAstralRange + ']',
                rsNonAstral = '[^' + rsAstralRange + ']',
                rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
                rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
                rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
                rsSeq = rsOptVar + reOptMod + rsOptJoin,
                rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
            let reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

            function toArray (val) { // 字符串转成数组
                return hasUnicode(val)
                    ? unicodeToArray(val)
                    : asciiToArray(val);
            }

            function hasUnicode (val) {
                return reHasUnicode.test(val);
            }

            function unicodeToArray (val) {
                return val.match(reUnicode) || [];
            }

            function asciiToArray (val) {
                return val.split('');
            }

            
            let nickname = toArray(userInfo.nickname);
            // let nickname = toArray(userInfo.nickname).split('')[0];
            let poster = {
                width: 472,
                height: 840,
                avatar: self.data.avatarThumb.path,
                // name: userInfo.nickname.split('')[0] + '**' + userInfo.nickname.split('')[userInfo.nickname.length-1] + '向你推荐',
                name: `${nickname[0]}**${nickname[nickname.length-1]}向你推荐`,
                nowPrice: self.data.goodsDetail.nowPrice,
                originPrice: self.data.goodsDetail.originPrice,
                title: self.data.goodsDetail.mainTitle,
                picUrl:  self.data.picThumb.path,
                // picUrl:  self.data.host + self.data.goodsDetail.picUrl,
                bgImg: self.data.bgThumb.path,
                qrCode: '',
                size: '',
                shareCode: self.data.shareCode
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
            ctx.fillText(`¥${poster.nowPrice}`, calculate(44), calculate(614+26))
            ctx.setFillStyle('#999')
            ctx.setFontSize(calculate(16))
            ctx.fillText(`¥${poster.originPrice}`, calculate(44), calculate(644+24))
            ctx.setFillStyle('#333')
            ctx.setFontSize(calculate(20))
            ctx.fillText(poster.title, calculate(44), calculate(682+20))
            ctx.setFillStyle('#333')
            ctx.setFontSize(calculate(20))
            ctx.fillText('长按或扫描购买', calculate(284), calculate(770+20))
            // ctx.setFillStyle('#999')
            // ctx.setFontSize(calculate(16))
            // ctx.fillText(poster.size, calculate(44), calculate(720+16))
            // ctx.setFillStyle('#333333')
            // ctx.setFontSize(calculate(12))
            // ctx.fillText(poster.size, calculate(328), calculate(746+12))

            //商品图片
            ctx.drawImage(poster.picUrl, calculate(20), calculate(134), calculate(432), calculate(442))

            //头像
            ctx.save()
            ctx.arc(calculate(22 + 30), calculate(44 + 30), calculate(60) / 2, 0, 2*Math.PI)
            ctx.clip()
            ctx.drawImage(poster.avatar, calculate(22), calculate(44), calculate(60), calculate(60))

            //分享二维码
            ctx.drawImage(poster.shareCode.path, calculate(280), calculate(620), calculate(150), calculate(150))
            
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