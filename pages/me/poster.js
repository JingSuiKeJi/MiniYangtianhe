// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Platform = require('../../service/Platfrom');

let data = {
	avatar:'',
	nickname:'',
	showModal: false,//模态框
	picThumb: {},
	shareCode: {},
	avatarThumb: {},
	canvasUrl: '',
	authorizeHidden: true,
};
const onLoad = function (self) {
	self.getData()
    const userInfo = _g.getLS(_c.LSKeys.userInfo);
	self.setData({
        // canvasUrl: _g.getLS('myPosterUrl'),
        userInfo: userInfo
	});
	event.on('me-poster-authorize', self, (res)=>{
		if (res.detail.authSetting['scope.writePhotosAlbum']) {
        	self.savePicToAlbum();
        	self.setData({
	            authorizeHidden: true,
	            showModal: false
	        });
        }
	});
}
const onShow = function (self) { }
const onReady = function (self) {
	if (self.data.canvasUrl) return;
	const userInfo = _g.getLS(_c.LSKeys.userInfo);
	if (userInfo && userInfo.avatar && !_g.getLS('avatarThumb')) {
		self.downloadImg({
			imgUrl: userInfo.avatar,
		}, (res) => {
			self.setData({
				avatarThumb: res
			},1);
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
	event.remove('me-poster-authorize', self);
}
const methods = {
	getData: function() {
		let self = this;
		self.getPoster();
		self.getShareCode();
	},
    getPoster: function () {
		const self = this;
		if (!_g.getLS('posterThumb')) {
			User.getPoster(self, {
				type: 1
			}).then((ret) => {
                let imgUrl = self.data.host +  ret.data.poster
                if (!ret.data.poster) imgUrl = 'https://app.yth-yx.com/mini/myposter.jpg';
                self.setData({
                    picUrl: imgUrl
                });
				self.downloadImg({
                    imgUrl: imgUrl,
				}, (res) => {
					self.setData({
                        picThumb: res,
					});
					// _g.setLS('posterThumb', res);
					self.checkDownload();
				},3);
				
			}, (err) => {
				self.downloadImg({
					imgUrl: 'https://app.yth-yx.com/mini/myposter.jpg'
				}, (res) => {
					self.setData({
						picThumb: res
					});
					// _g.setLS('posterThumb', res);
					self.checkDownload();
				},3);
				
			});
		} else {
			self.setData({
				picThumb: _g.getLS('posterThumb')
			});
		}
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
		}, (result)=>{
			if (result == undefined || result) {
	            // self.onSaveTap();
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
			// page: 'pages/home/index'
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
			},2);
			
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
						success(result) {
							callback && callback(result);
						},
						fail(err) {
							wx.hideLoading();
							self.getImgToast(type);
						}
					});
				}
            },
            fail(err) {
                self.downloadToast(type)
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
			picUrl:  self.data.picThumb.path,
			shareCode: self.data.shareCode
		};
		const ctx = wx.createCanvasContext('share',self)
		ctx.setFillStyle('white')
        ctx.fillRect(0, 0, calculate(542), calculate(964))
		//画背景
		ctx.drawImage(poster.picUrl,0, 0, calculate(542), calculate(770))
		ctx.setFillStyle('#333');
		ctx.setFontSize(calculate(26))
		ctx.fillText(poster.name,calculate(50), calculate(744))
		ctx.setFillStyle('#333');
		ctx.setFontSize(calculate(26))
		ctx.fillText('|长按识别小程序码|',calculate(224), calculate(874))
		//头像
		ctx.save()
		ctx.beginPath() 
		ctx.arc(calculate(38 + 53), calculate(610 + 53), calculate(106) / 2, 0, 2*Math.PI)
		ctx.setStrokeStyle('white')
		ctx.stroke();
		ctx.clip()
		ctx.drawImage(poster.avatar, calculate(38), calculate(610), calculate(106), calculate(106))
        ctx.restore()
		//分享二维码
		// ctx.save()
		ctx.drawImage(poster.shareCode.path, calculate(42), calculate(784), calculate(140), calculate(140))
		
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
					// _g.setLS('myPosterUrl', res.tempFilePath);
				}
			}, self);
		},self);

		function calculate(size) {
			return winWidth * size / UIWidth;
		}
	},
	onShareAppMessage() {
		const self = this;
		const userInfo = _g.getLS(_c.LSKeys.userInfo);
		const path = `pages/home/index?promoCode=${userInfo.promoCode}`;
		return {
            title: '一起加入养天和吧',
            path: path,
            imageUrl: self.data.canvasUrl
        }
    },
    downloadToast: function (type) {
        let self = this;
        let message = '';
        switch (type) {
            case 1:
                message = '网络不稳定，头像下载失败，请在网络较好的情况下重试'
                break;
            case 2:
                message = '网络不稳定，小程序码下载失败，请在网络较好的情况下重试'
                break;
            case 3:
                message = '网络不稳定，背景图下载失败，请在网络较好的情况下重试'
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
                message = '网络不稳定，获取本地的头像失败，请在网络较好的情况下重试'
                break;
            case 2:
                message = '网络不稳定，获取本地小程序码失败，请在网络较好的情况下重试'
                break;
            case 3:
                message = '网络不稳定，获取本地背景图失败，请在网络较好的情况下重试'
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