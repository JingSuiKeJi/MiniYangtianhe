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
	canvasUrl: ''
};
const onLoad = function (self) {
	self.getData()
	const avatar = self.data.avatar;
	const nickname = self.data.nickname;
	self.setData({
		avatar:avatar,
		nickname:nickname,
	})
}
const onShow = function (self) { }
const onReady = function (self) {
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
}
const onUnload = function (self) { }
const methods = {
	getData: function() {
		let self = this;
		self.getPoster();
		self.getShareCode();
	},
    getPoster: function () {
		const self = this;
		User.getPoster(self, {
			type: 1
		}).then((ret) => {
			self.downloadImg({
				imgUrl: self.data.host +  ret.data.poster
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
		self.onSaveTap();
		self.hideModal();
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
		// sence += '&id=' + self.data.goodsDetail.id;
		// sence += '&t=' + self.data.thirdId;

		Platform.getShareQR(self, {
			scene: sence,
			page: 'pages/me/poster'
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
		ctx.fillText(poster.name,calculate(38), calculate(744))
		ctx.setFillStyle('#333');
		ctx.setFontSize(calculate(26))
		ctx.fillText('|长按识别小程序码|',calculate(224), calculate(874))
		//头像
		ctx.save()
		ctx.arc(calculate(38 ), calculate(610), calculate(106) / 2, 0, 2*Math.PI)
		ctx.clip()
		ctx.drawImage(poster.avatar, calculate(38), calculate(610), calculate(106), calculate(106))

		//分享二维码
		// ctx.save()
		ctx.drawImage(poster.shareCode.path, calculate(42), calculate(804), calculate(140), calculate(124))
		
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