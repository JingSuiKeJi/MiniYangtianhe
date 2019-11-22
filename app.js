//app.js
App({
    onLaunch: function (opts) {
        // 引入相关js
        this.base = require('/libs/base.js');
        this.promise = require('/libs/q.js');
        this.underscore = require('/libs/underscore.js');
        this.event = require('/libs/event.js');
        this.config = require('/libs/config.js');
        this.temps = require('/templates/temps.js');
        const updateManager = wx.getUpdateManager();
        // updateManager.onCheckForUpdate(function(res) {
        //     // 请求完新版本信息的回调
        //     console.log(res.hasUpdate)
        // });
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        var self = this;
        self.base.logger();
        wx.getSystemInfo({
            success(res) {
                self.base.setLS('systemType', res.platform);
                self.base.setLS('systemInfo', res);
                //获取状态栏高度
                self.base.setLS('statusBarHeight', res.statusBarHeight);
                let bar2Bottom = 0;
                if (res.platform == 'ios') {
                    let model = res.model.split('<')[1].split('>')[0];
                    let modelType = model.split('iPhone')[1].split(',');
                    if (modelType[0] == 11) {
                        bar2Bottom = 34;
                    } else if (modelType[0] == 10 && modelType[1] == 2) {
                        bar2Bottom = 34;
                    } else {
                        bar2Bottom = 20;
                    }
                } else {
                    bar2Bottom = 20;
                }
                self.base.setLS('bar2Bottom', bar2Bottom);
            }
        });
        self.base.rmLS('posterThumb');
        self.base.rmLS('avatarThumb');
        self.base.rmLS('myPosterUrl');
        self.base.rmLS('goodsPosterBg');
        self.base.getGoodsPosterBg(self);
    },
    onShow: function () {
        this.base = require('/libs/base.js');
        this.config = require('/libs/config.js');
        var self = this;
        if (!self.base.checkLogin({ type: 1 }) && getCurrentPages().length > 0) {
            if (getCurrentPages()[0].route != 'pages/home/login') {
                self.base.navigateTo({
                    url: 'pages/home/login'
                }, self)
            }
        }
    },
    globalData: {
        //状态栏高度
        statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
        //手机屏幕可用高度
        screenHeight: wx.getSystemInfoSync()['screenHeight'],
    }

});