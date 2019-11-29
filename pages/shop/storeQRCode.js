// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Platfrom = require('../../service/Platfrom');

let data = {
	userInfo:{},//接收上一页用户信息
	shareQR:'',//门店二维码
	picThumb: {},
	shareCode: {},
	avatarThumb: {},
	canvasUrl: '',
	authorizeHidden: true,
};
const onLoad = function(self) {
	//接收上一个页面状态
	const userInfo = self.data.userInfo;
	self.setData({
		userInfo:userInfo,
	});
	event.on('me-storeQRCode-authorize', self, (res)=>{
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
const onShow = function(self) {}
const onReady = function(self) {
	self.authorize = self.selectComponent('#authorize');
    self.authorize.onCancelTap = function () {
        self.setData({
            authorizeHidden: true
        });
    }
}
const onUnload = function(self) {
	event.remove('me-storeQRCode-authorize', self);
}
const methods = {
	getData:function(){
		const self = this;
		Platfrom.getShareQR(self, {
	        scene:'p=' + _g.getLS(_c.LSKeys.userInfo).promoCode,
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
	checkDownload() {
		const self = this;
		if (!_.isEmpty(self.data.shareCode)) {
		   self.drawPoster();
	    }
		
	},
	drawPoster() {
		const self = this;
		const userInfo = _g.getLS(_c.LSKeys.userInfo);
		const UIWidth = 750;
		const winWidth = _g.getLS(_c.LSKeys.systemInfo).windowWidth;
		let poster = {
			// avatar: self.data.avatarThumb.path,
			// name: userInfo.nickname,
			// picUrl:  self.data.picThumb.path,
			store: self.data.userInfo.store,
			shareCode: self.data.shareCode
		};
		const ctx = wx.createCanvasContext('share',self)
		ctx.setFillStyle('white')
        ctx.fillRect(0, 0, calculate(670), calculate(756))
		// //画背景
		ctx.setFillStyle('#F5F5F5')
		ctx.fillRect(0, 0, calculate(670), calculate(134));
		ctx.setFillStyle('#3D3D3D');
		ctx.setFontSize(calculate(34))
		ctx.fillText(poster.store.title,calculate(32), calculate(50))
		ctx.setFillStyle('#3D3D3D');
		ctx.setFontSize(calculate(26))
		ctx.fillText(poster.store.address,calculate(32), calculate(86))
		// //分享二维码
		// // ctx.save()
		ctx.drawImage(poster.shareCode.path, calculate(74), calculate(204), calculate(520), calculate(470))
		
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
		const path = `pages/home/login?storeId=${userInfo.store.id}&promoCode=${userInfo.promoCode}`;
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
		}, (result)=>{
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